import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import { cartDAO } from "#dao/cart/cart.dao.js";
import { AppError, NotFoundError } from "#utils/errors.js";
import { withTransaction } from "../utils.js";

const getUserProfileByIdService = async (userId) => {
  const userProfile = await userDAO.getActiveUserById(userId);
  if (!userProfile)
    throw new NotFoundError(`User with id ${userId} doesn't exist`);

  return userProfile;
};

const updateUserProfileByIdService = async (userId, fieldsToUpdate) => {
  await getUserProfileByIdService(userId);

  if (fieldsToUpdate.email) {
    const isUnique = await userDAO.isEmailUnique(fieldsToUpdate.email);
    if (!isUnique) throw new AppError("Email already in use", 409);
  }

  return await userDAO.updateUser(userId, fieldsToUpdate);
};

const softDeleteProfileByIdService = async (userId) => {
  await getUserProfileByIdService(userId);
  await userDAO.softDelete(userId);
};

const deleteProfileByIdService = async (userId) =>
  withTransaction(async (session) => {
    const user = await getUserProfileByIdService(userId);

    if (user.cart) {
      await cartDAO.deleteCart(user.cart, { session });
    }

    for (const address of user.addresses) {
      await addressDAO.deleteAddress(address, { session });
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
