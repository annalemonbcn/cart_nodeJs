import { Router } from "express";
import UserModel from "#models/user.model.js";
import { authenticateJwt } from "#middlewares/auth/index.js";

const router = Router();

router.get("/me", authenticateJwt, async (req, res) => {
  const { _id } = req.user;

  const user = await UserModel.findById(_id).select(
    "-password -role -googleId -authProvider -createdAt -updatedAt -__v"
  );

  if (!user)
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "User not found",
    });

  res.status(200).json({
    status: "success",
    code: 200,
    payload: user,
  });
});

export default router;
