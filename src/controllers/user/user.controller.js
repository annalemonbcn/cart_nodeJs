import { userServices } from "#services/user.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  deleteProfileByIdService,
} = userServices;

const getCurrentUserProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new BadRequestError("Missing user id");

  try {
    const userProfile = await getUserProfileByIdService(userId);

    res.status(200).json({
      status: "success",
      code: 200,
      payload: userProfile,
    });
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);

    const status = error.statusCode || 500;
    const message = error.message || "Internal server error";

    res.status(status).json({
      status: "error",
      code: status,
      message,
    });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new BadRequestError("Missing user id");

  const fieldsToUpdate = req.body;

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new BadRequestError("Missing fields to update");
  }

  try {
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
  } catch (error) {
    console.error("Error in updateProfile:", error);

    const status = error.statusCode || 500;
    const message = error.message || "Internal server error";

    res.status(status).json({
      status: "error",
      code: status,
      message,
    });
  }
};

const deleteProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new BadRequestError("Missing user id");

  try {
    await deleteProfileByIdService(userId);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProfile:", error);

    const status = error.statusCode || 500;
    const message = error.message || "Internal server error";

    res.status(status).json({
      status: "error",
      code: status,
      message,
    });
  }
};

export { getCurrentUserProfile, updateProfile, deleteProfile };
