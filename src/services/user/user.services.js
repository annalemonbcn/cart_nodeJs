import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import { cartDAO } from "#dao/cart/cart.dao.js";
import { AppError, BadRequestError, NotFoundError } from "#utils/errors.js";
import { withTransaction } from "../utils.js";
import { updateUserProfileSchemaValidation } from "./validations.js";

const getUserProfileByIdService = async (userId) => {
  const userProfile = await userDAO.getActiveUserById(userId);
  if (!userProfile)
    throw new NotFoundError(`User with id ${userId} doesn't exist`);

  return userProfile;
};

const updateUserProfileByIdService = async (userId, fieldsToUpdate) => {
  await getUserProfileByIdService(userId);

  const { error } = updateUserProfileSchemaValidation.validate(fieldsToUpdate);
  if (error) throw new BadRequestError(error.details[0].message);

  if (fieldsToUpdate.email) {
    const isUnique = await userDAO.isEmailUnique(fieldsToUpdate.email);
    if (!isUnique) throw new AppError("Email already in use", 409);
  }

  return await userDAO.updateUser(userId, fieldsToUpdate);
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
  });

const deleteProfileByIdService = async (userId) =>
  withTransaction(async (session) => {
    const user = await getUserProfileByIdService(userId);

    if (user.cart) {
      await cartDAO.hardDelete(user.cart, { session });
    }

    for (const address of user.addresses) {
      await addressDAO.hardDelete(address, { session });
    }

    await userDAO.hardDelete(userId, { session });
  });

const userServices = {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  softDeleteProfileByIdService,
  deleteProfileByIdService,
};

export { userServices };
