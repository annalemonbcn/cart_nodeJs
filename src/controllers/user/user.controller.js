import { userServices } from "#services/user.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  deleteProfileByIdService,
} = userServices;

const getCurrentUserProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId)
    throw new BadRequestError("getCurrentUserProfile: Missing user id");

  const userProfile = await getUserProfileByIdService(userId);

  res.status(200).json({
    status: "success",
    code: 200,
    payload: userProfile,
  });
};

const updateProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new BadRequestError("updateProfile: Missing user id");

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

const deleteProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new BadRequestError("deleteProfile: Missing user id");

  await deleteProfileByIdService(userId);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "User profile deleted successfully",
  });
};

export { getCurrentUserProfile, updateProfile, deleteProfile };
