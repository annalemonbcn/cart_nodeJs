import { userDAO } from "#dao/user/user.dao.js";
import { userServices } from "../user/user.services.js";

const { getUserProfileByIdService } = userServices;

const getFavouritesService = async (userId, { populate } = {}) => {
  const user = await userDAO.getUserFavourites(userId, { populate });

  if (!user) throw new NotFoundError(`User with id ${userId} doesn't exist`);

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
