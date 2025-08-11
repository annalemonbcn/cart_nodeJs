import UserModel from "#models/user.model.js";

const getUserById = async (userId) => await UserModel.findById(userId);

const addAddressToUser = async (userId, addressId) => {
  await UserModel.findByIdAndUpdate(userId, {
    $push: { addresses: addressId },
  });
  return await getUserById(userId);
};

const removeAddressFromUser = async (userId, addressId) => {
  return await UserModel.findByIdAndUpdate(userId, {
    $pull: { addresses: addressId },
  });
};

const userDAO = {
  getUserById,
  addAddressToUser,
  removeAddressFromUser,
};

export { userDAO };
