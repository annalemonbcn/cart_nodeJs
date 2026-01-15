import { Router } from "express";
import { authenticateAndAuthorize } from "#middlewares/auth/index.js";
import {
  getCurrentUserProfile,
  updateProfile,
  changePassword,
  softDeleteProfile,
  deleteProfile,
  getFavourites,
  toggleFavourite,
} from "#controllers/user/user.controller.js";
import { validateParam } from "#middlewares/validateParam/index.js";
import { collectionNames } from "../../db/constants/index.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.get("/me", getCurrentUserProfile);
router.put("/", updateProfile);
router.patch("/change-password", changePassword);
router.delete("/soft", softDeleteProfile);
router.delete(
  "/:userId/hard",
  authenticateAndAuthorize("admin"),
  deleteProfile
);

router.get("/favourites", getFavourites);

router.param(
  "productId",
  validateParam("productId", collectionNames.productsCollection, "product")
);
router.patch("/favourites/:productId", toggleFavourite);

export default router;
