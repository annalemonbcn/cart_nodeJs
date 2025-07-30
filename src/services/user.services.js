import UserModel from "#models/user.model.js";

const getUserProfileByIdService = async (userId) => {
  return await UserModel.findById(userId).select(
    "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
  );
};

const userServices = {
  getUserProfileByIdService,
};

export { userServices };
