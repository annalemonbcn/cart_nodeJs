import { userServices } from "#services/user/user.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  getUserProfileByIdService,
  updateUserProfileByIdService,
  updatePasswordService,
  deleteProfileByIdService,
  softDeleteProfileByIdService,
  getFavouritesService,
  toggleFavouriteService,
} = userServices;

const getCurrentUserProfile = async (req, res) => {
  const meProfile = await getUserProfileByIdService(req.user.id);

  res.status(200).json({
    status: "success",
    code: 200,
    payload: meProfile,
  });
};

const updateProfile = async (req, res) => {
  const fieldsToUpdate = req.body;
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new BadRequestError("updateProfile: Missing fields to update");
  }

  const updatedProfile = await updateUserProfileByIdService(
    req.user.id,
    fieldsToUpdate
  );

  res.status(200).json({
    status: "success",
    code: 200,
    payload: updatedProfile,
    message: "User profile updated successfully",
  });
};

const changePassword = async (req, res) => {
  const { password: newPassword } = req.body;
  if (!newPassword) throw new BadRequestError("Missing password");

  await updatePasswordService(req.user.id, newPassword);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "User password updated successfully",
  });
};

const softDeleteProfile = async (req, res) => {
  await softDeleteProfileByIdService(req.user.id);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "User profile soft deleted successfully",
  });
};

const deleteProfile = async (req, res) => {
  if (req.user.id === req.params.userId) {
    throw new BadRequestError("Admin cannot delete themselves");
  }

  await deleteProfileByIdService(req.params.userId);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "User profile deleted successfully",
  });
};

const getFavourites = async (req, res) => {
  const favourites = await getFavouritesService(req.user.id);

  res.status(200).json({
    status: "success",
    code: 200,
    payload: favourites,
    message: "User favourites retrieved successfully",
  });
};

const toggleFavourite = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const user = await toggleFavouriteService(userId, productId);
  const favourites = user.favourites;

  res.status(200).json({
    status: "success",
    code: 200,
    payload: favourites,
    message: "User favourites toggled successfully",
  });
};

export {
  getCurrentUserProfile,
  updateProfile,
  changePassword,
  softDeleteProfile,
  deleteProfile,
  getFavourites,
  toggleFavourite,
};
