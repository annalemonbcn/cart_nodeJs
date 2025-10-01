import UserModel from "#models/user.model.js";

const createUser = async (user, options = {}) => {
  const users = await UserModel.create([user], options);
  return users[0];
};

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

const getUserByEmail = async (email) => await UserModel.findOne({ email });

const getActiveUserByEmail = async (email) =>
  await UserModel.findOne({ email, deletedAt: null });

const getActiveUserByGoogleId = async (googleId) =>
  await UserModel.findOne({ googleId, deletedAt: null });

const updateUser = async (userId, fieldsToUpdate, options = {}) =>
  await UserModel.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
    ...options,
  });

const updatePassword = async (userId, password) =>
  await UserModel.findByIdAndUpdate(userId, { password }, { new: true });

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
  createUser,
  getUserById,
  getUserByEmail,
  getActiveUserById,
  getActiveUserByEmail,
  getActiveUserByGoogleId,
  updateUser,
  updatePassword,
  addAddressToUser,
  removeAddressFromUser,
  isEmailUnique,
  softDelete,
  hardDelete,
};

export { userDAO };
