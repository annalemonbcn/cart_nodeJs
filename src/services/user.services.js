import UserModel from "#models/user.model.js";
import { AppError, NotFoundError } from "#utils/errors.js";
import { validateUniqueEmail } from "#utils/validations.js";

const getUserProfileByIdService = async (userId) => {
  const userProfile = await UserModel.findById(userId).select(
    "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
  );
  console.log('userProfile', userProfile)

  if (!userProfile)
    throw new NotFoundError(`User with id ${userId} doesn't exist`);

  return userProfile;
};

const updateUserProfileByIdService = async (userId, fieldsToUpdate) => {
  const userProfile = await getUserProfileByIdService(userId);

  if (!userProfile)
    throw new NotFoundError(`User with id ${userId} doesn't exist`);

  if (fieldsToUpdate.email) {
    const isUnique = await validateUniqueEmail(fieldsToUpdate.email);
    if (!isUnique) throw new AppError("Email already in use", 409);
  }

  return await UserModel.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
  }).select(
    "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
  );
};

const deleteProfileByIdService = async (userId) => {
  const userProfile = await getUserProfileByIdService(userId);

  if (!userProfile)
    throw new NotFoundError(`User with id ${userId} doesn't exist`);

  return await UserModel.findByIdAndDelete(userId);
}

const userServices = {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  deleteProfileByIdService,
};

export { userServices };
