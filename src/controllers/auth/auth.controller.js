import { authServices } from "#services/auth/auth.services.js";
import { generateToken } from "./utils.js";
import { BadRequestError } from "#utils/errors.js";

const { registerUserService, loginUserService, forgotPasswordService } = authServices;

const sanitizeUser = (user) => {
  const toJSON = user.toJSON();

  return {
    id: toJSON.id,
    firstName: toJSON.firstName,
    lastName: toJSON.lastName,
    email: toJSON.email,
    phoneNumber: toJSON.phoneNumber,
    cart: toJSON.cart,
    addresses: toJSON.addresses,
  };
};

const registerUser = async (req, res, next) => {
  if (!Object.keys(req.body).length)
    throw new BadRequestError("Missing user data in request");

  try {
    const { error, user } = await registerUserService(req);

    if (error) throw error;

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "User successfully created",
      payload: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  if (!Object.keys(req.body).length)
    throw new BadRequestError("Missing user data in request");

  try {
    const { error, user } = await loginUserService(req);
    if (error) throw error;

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: !user.deletedAt,
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if(!email) throw new BadRequestError("Missing email in request");



  forgotPasswordService(email)

};

const FRONT_URL = "http://localhost:5173";

const googleCallback = (req, res) => {
  const token = generateToken({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    isActive: !req.user.deletedAt,
  });
  res.redirect(`${FRONT_URL}/auth/success?token=${token}`);
};

export { registerUser, loginUser, forgotPassword, googleCallback };
