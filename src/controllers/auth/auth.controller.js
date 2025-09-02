import { authServices } from "#services/auth.services.js";
import { generateToken } from "./utils.js";
import { BadRequestError } from "#utils/errors.js";

const { registerUserService, loginUserService } = authServices;

const registerUser = async (req, res, next) => {
  if (!Object.keys(req.body).length)
    throw new BadRequestError("registerUser: Missing user data in request");

  try {
    const { error, user } = await registerUserService(req);

    if (error) throw error;

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "User successfully created",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  if (!Object.keys(req.body).length)
    throw new BadRequestError("loginUser: Missing user data in request");

  try {
    const { error, user } = await loginUserService(req);
    if (error) throw error;

    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "User successfully logged in",
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const FRONT_URL = "http://localhost:5173";

const googleCallback = (req, res) => {
  const token = generateToken({
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
  res.redirect(`${FRONT_URL}/auth/success?token=${token}`);
};

export { registerUser, loginUser, googleCallback };
