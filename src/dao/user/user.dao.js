import UserModel from "#models/user.model.js";

const getUserById = async (userId) =>
  await UserModel.findById(userId)
    .select(
      "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
    )
    .populate("addresses");

const getActiveUserById = async (userId) =>
  await UserModel.findOne({ _id: userId, deletedAt: null })
    .select(
      "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
    )
    .populate("addresses");

const updateUser = async (userId, fieldsToUpdate) =>
  await UserModel.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select(
    "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
  );

const addAddressToUser = async (userId, addressId) => {
  await UserModel.findByIdAndUpdate(userId, {
    $push: { addresses: addressId },
  });
  return await getUserById(userId);
};

const removeAddressFromUser = async (userId, addressId, session) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { addresses: addressId } },
    { session }
  );
};

const isEmailUnique = async (email) => {
  const existingUser = await UserModel.findOne({ email });
  return !existingUser;
};

const softDelete = async (userId, options = {}) =>
  await UserModel.findByIdAndUpdate(userId, { deletedAt: new Date() }, options);

const hardDelete = async (userId, options = {}) =>
  await UserModel.findByIdAndDelete(userId, options);

const userDAO = {
  getUserById,
  getActiveUserById,
  updateUser,
  addAddressToUser,
  removeAddressFromUser,
  isEmailUnique,
  softDelete,
  hardDelete,
};

export { userDAO };
