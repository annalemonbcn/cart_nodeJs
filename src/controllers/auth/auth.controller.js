import { authServices } from "#services/auth.services.js";
import { cleanUser, generateToken } from "./utils.js";

const { registerUserService, loginUserService } = authServices;

const registerUser = async (req, res, next) => {
  if (!Object.keys(req.body).length)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing user data in request",
    });

  try {
    const { error, user, info } = await registerUserService(req);
    console.log("user", user);

    if (error) return next(error);

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: info.message });
    }

    const userObj = cleanUser(user);
    return res.status(201).json({
      status: "success",
      code: 201,
      message: "User successfully created",
      payload: userObj,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  if (!Object.keys(req.body).length)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing user data in request",
    });

  try {
    const { error, user, info } = await loginUserService(req);

    if (error) return next(error);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", code: 401, message: info.message });
    }

    const userObj = cleanUser(user);
    const token = generateToken(userObj);
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
  const token = generateToken({ _id: req.user._id });
  res.redirect(`${FRONT_URL}/auth/success?token=${token}`);
};

export { registerUser, loginUser, googleCallback };
