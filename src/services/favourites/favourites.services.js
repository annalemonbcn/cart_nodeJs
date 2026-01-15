import { userDAO } from "#dao/user/user.dao.js";
import { userServices } from "../user/user.services.js";

const { getUserProfileByIdService } = userServices;

const getFavouritesService = async (userId) => {
  const user = await getUserProfileByIdService(userId);
  return user.favourites;
};

const toggleFavouriteService = async (userId, productId) => {
  const user = await getUserProfileByIdService(userId);
  const favourites = user.favourites;

  const exists = favourites.some((id) => id.toString() === productId);

  if (exists)
    return {
      action: "removed",
      user: await userDAO.removeFavourite(userId, productId),
    };
  return {
    action: "added",
    user: await userDAO.setFavourite(userId, productId),
  };
};

const favouritesServices = {
  getFavouritesService,
  toggleFavouriteService,
};

export { favouritesServices };
