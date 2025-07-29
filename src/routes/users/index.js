import { Router } from "express";
import { authenticateJwt } from "#middlewares/auth/index.js";
import { getCurrentUserProfile } from "#controllers/user/user.controller.js";

const router = Router();

router.get("/me", authenticateJwt, getCurrentUserProfile);

export default router;
