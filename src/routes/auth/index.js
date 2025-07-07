import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv-flow/config";

const router = Router();

const SECRET = process.env.JWT_SECRET;

router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: info.message });
    }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.createdAt;
    delete userObj.updatedAt;

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "User successfully created",
      payload: userObj,
    });
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", code: 401, message: info.message });
    }

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;

    const token = jwt.sign(user, SECRET, { expiresIn: "1h" });

    return res.status(200).send({
      status: "success",
      code: 200,
      message: "User successfully logged in",
      payload: { token },
    });
  })(req, res, next);
});

export default router;
