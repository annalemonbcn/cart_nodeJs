import { Router } from "express";
import { authenticateAndAuthorize } from "#middlewares/auth/index.js";
import {
  getCurrentUserProfile,
  updateProfile,
  softDeleteProfile,
  deleteProfile,
} from "#controllers/user/user.controller.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.get("/me", getCurrentUserProfile);
router.put("/", updateProfile);
router.delete("/soft", softDeleteProfile);
router.delete(":userId/hard", authenticateAndAuthorize("admin"), deleteProfile);

export default router;
