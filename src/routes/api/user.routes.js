import { Router } from "express";
import { authenticateJwt } from "#middlewares/auth/index.js";
import { getCurrentUserProfile, updateProfile, deleteProfile } from "#controllers/user/user.controller.js";

const router = Router();

router.get("/me", authenticateJwt, getCurrentUserProfile);
router.put("/:uid", authenticateJwt, updateProfile);
router.delete("/:uid", authenticateJwt, deleteProfile);

export default router;
