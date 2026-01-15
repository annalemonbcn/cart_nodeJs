import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import { cartDAO } from "#dao/cart/cart.dao.js";
import { AppError, BadRequestError, NotFoundError } from "#utils/errors.js";
import { withTransaction } from "#utils/transactions.js";
import {
  updatePasswordSchemaValidation,
  updateUserProfileSchemaValidation,
} from "./validations.js";
import { encryptPassword } from "#utils/bcrypt.js";
import { sendBrevoMail } from "#config/mailer/index.js";

const getUserProfileByIdService = async (userId) => {
  const userProfile = await userDAO.getActiveUserById(userId);
  if (!userProfile)
    throw new NotFoundError(`User with id ${userId} doesn't exist`);

  return userProfile;
};

const updateUserProfileByIdService = async (userId, fieldsToUpdate) => {
  if (fieldsToUpdate.password) throw new BadRequestError();

  const { error } = updateUserProfileSchemaValidation.validate(fieldsToUpdate);
  if (error) throw new BadRequestError(error.details[0].message);

  if (fieldsToUpdate.email) {
    const isUnique = await userDAO.isEmailUnique(fieldsToUpdate.email);
    if (!isUnique) throw new AppError("Email already in use", 409);
  }

  return await userDAO.updateUser(userId, fieldsToUpdate);
};

const updatePasswordService = async (userId, newPassword) => {
  const { error } = updatePasswordSchemaValidation.validate({
    password: newPassword,
  });
  if (error) throw new BadRequestError(error.details[0].message);

  const hashedPassword = encryptPassword(newPassword);

  const user = await userDAO.updatePassword(userId, hashedPassword);

  await sendBrevoMail({
    to: user.email,
    templateId: process.env.BREVO_TEMPLATE_PASSWORD_UPDATED,
    dynamicTemplateData: {
      firstName: user.firstName || "",
      profileURL: `${process.env.FRONTEND_URL}/my-account/profile`,
    },
  });

  return user;
};

const softDeleteProfileByIdService = async (userId) =>
  withTransaction(async (session) => {
    const user = await getUserProfileByIdService(userId);

    if (user.cart) {
      await cartDAO.softDelete(user.cart, { session });
    }

    for (const address of user.addresses) {
      await addressDAO.softDelete(address, { session });
    }

    await userDAO.softDelete(userId, { session });

    await sendBrevoMail({
      to: user.email,
      templateId: process.env.BREVO_TEMPLATE_DELETE_ACCOUNT,
      dynamicTemplateData: {
        firstName: user.firstName || "",
      },
    });
  });

const deleteProfileByIdService = async (userId) =>
  withTransaction(async (session) => {
    const user = await userDAO.getUserById(userId);
    if (!user) throw new NotFoundError(`User with id ${userId} doesn't exist`);

    if (user.cart) {
      await cartDAO.hardDelete(user.cart, { session });
    }

    for (const address of user.addresses) {
      await addressDAO.hardDelete(address, { session });
    }

    await userDAO.hardDelete(userId, { session });
  });

const getFavouritesService = async (userId) => {
  const user = await getUserProfileByIdService(userId);
  return user.favourites;
};

const toggleFavouriteService = async (userId, productId) => {
  const user = await getUserProfileByIdService(userId);
  const favourites = user.favourites;

  const exists = favourites.some((id) => id.toString() === productId);

  if (exists) return await userDAO.removeFavourite(userId, productId);
  return await userDAO.setFavourite(userId, productId);
};

const userServices = {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  updatePasswordService,
  softDeleteProfileByIdService,
  deleteProfileByIdService,
  getFavouritesService,
  toggleFavouriteService,
};

export { userServices };
