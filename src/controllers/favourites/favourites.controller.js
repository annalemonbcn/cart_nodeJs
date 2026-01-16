import { favouritesServices } from "#services/favourites/favourites.services.js";

const { getFavouritesService, toggleFavouriteService } = favouritesServices;

const getFavourites = async (req, res) => {
  const populate = req.query.populate === "true";

  const favourites = await getFavouritesService(req.user.id, { populate });

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

  const { user, action } = await toggleFavouriteService(userId, productId);
  const favourites = user.favourites;

  res.status(200).json({
    status: "success",
    code: 200,
    payload: favourites,
    message: `User favourite ${
      action === "added" ? "added" : "removed"
    } successfully`,
    meta: { action },
  });
};

export { getFavourites, toggleFavourite };
