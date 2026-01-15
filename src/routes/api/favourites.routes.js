import { authenticateAndAuthorize } from "#middlewares/auth/index.js";
import { validateParam } from "#middlewares/validateParam/index.js";
import { Router } from "express";
import { collectionNames } from "../../db/constants/index.js";
import {
  getFavourites,
  toggleFavourite,
} from "#controllers/favourites/favourites.controller.js";

const router = Router();

router.use(authenticateAndAuthorize());
router.param(
  "productId",
  validateParam("productId", collectionNames.productsCollection, "product")
);

router.get("/", getFavourites);
router.patch("/:productId", toggleFavourite);

export default router;
