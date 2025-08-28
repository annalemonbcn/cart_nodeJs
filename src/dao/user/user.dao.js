import UserModel from "#models/user.model.js";

const getUserById = async (userId) =>
  await UserModel.findById(userId).populate("addresses");

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

const userDAO = {
  getUserById,
  addAddressToUser,
  removeAddressFromUser,
};

export { userDAO };
