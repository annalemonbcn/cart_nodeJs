import { userServices } from "#services/user/user.services.js";
import { BadRequestError } from "#utils/errors.js";
import { validateUserIdInReq } from "./validations.js";

const {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  deleteProfileByIdService,
  softDeleteProfileByIdService,
} = userServices;

const getCurrentUserProfile = async (req, res) => {
  const userId = validateUserIdInReq(req);

  const meProfile = await getUserProfileByIdService(userId);

  res.status(200).json({
    status: "success",
    code: 200,
    payload: meProfile,
  });
};

const updateProfile = async (req, res) => {
  const userId = validateUserIdInReq(req);

  const fieldsToUpdate = req.body;
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new BadRequestError("updateProfile: Missing fields to update");
  }

  const updatedProfile = await updateUserProfileByIdService(
    userId,
    fieldsToUpdate
  );

  res.status(200).json({
    status: "success",
    code: 200,
    payload: updatedProfile,
    message: "User profile updated successfully",
  });
};

const softDeleteProfile = async (req, res) => {
  const userId = validateUserIdInReq(req);

  await softDeleteProfileByIdService(userId);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "User profile soft deleted successfully",
  });
};

const deleteProfile = async (req, res) => {
  const { userId: userIdParam } = req.params;
  if (!userIdParam) throw new BadRequestError("Invalid user id");

  if (req.user._id === userIdParam) {
    throw new BadRequestError("Admin cannot delete themselves");
  }

  await deleteProfileByIdService(userIdParam);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "User profile deleted successfully",
  });
};

export {
  getCurrentUserProfile,
  updateProfile,
  softDeleteProfile,
  deleteProfile,
};
