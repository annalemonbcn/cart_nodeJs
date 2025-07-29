import { userServices } from "#services/user.services.js";

const { getUserProfileByIdService } = userServices;

const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const userProfile = await getUserProfileByIdService(userId);

    if (!userProfile) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      payload: userProfile,
    });
  } catch (err) {
    console.error("Error in getCurrentUserProfile:", err);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
};

export { getCurrentUserProfile };
