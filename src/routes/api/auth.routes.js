import { Router } from "express";
import passport from "passport";
import { loginUser, registerUser, googleCallback } from "#controllers/auth/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

export default router;
