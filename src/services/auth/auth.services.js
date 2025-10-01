import "dotenv-flow/config";
import nodemailer from "nodemailer";
import passport from "passport";
import { userDAO } from "#dao/user/user.dao.js";
import { BadRequestError, NotFoundError } from "#utils/errors.js";
import {
  emailSchemaValidation,
  passwordSchemaValidation,
} from "./validations.js";
import { decodeToken, generateToken } from "#controllers/auth/utils.js";
import { encryptPassword } from "#utils/bcrypt.js";
import { emailTemplates } from "#utils/emailtemplates/resetPassword.js";
import sgMail from "#config/sendgrid/index.js";

const registerUserService = (req) => {
  return new Promise((resolve) => {
    passport.authenticate(
      "register",
      { session: false },
      (error, user, info) => {
        resolve({ error, user, info });
      }
    )(req);
  });
};

const loginUserService = (req) => {
  return new Promise((resolve) => {
    passport.authenticate("login", { session: false }, (error, user, info) => {
      resolve({ error, user, info });
    })(req);
  });
};

const forgotPasswordService = async (email) => {
  const { error } = emailSchemaValidation.validate({ email });
  if (error) throw new BadRequestError(error.details[0].message);

  const user = await userDAO.getActiveUserByEmail(email);
  if (!user) throw new NotFoundError("User not found");

  const token = generateToken({ id: user._id, email: user.email });
  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}&mode=reset`;

  const msg = {
    to: user.email,
    from: "annalemonbcn.dev@gmail.com",
    subject: "Password Reset Request",
    html: emailTemplates.passwordResetTemplate(user, resetURL),
  };

  await sgMail.send(msg);
};

const resetPasswordService = async (token, password) => {
  const { error } = passwordSchemaValidation.validate({ password });
  if (error) throw new BadRequestError(error.details[0].message);

  const decoded = decodeToken(token);

  const activeUser = await userDAO.getActiveUserByEmail(decoded.email);
  if (!activeUser) throw new NotFoundError("User not found");

  const hashedPassword = encryptPassword(password);

  await userDAO.updatePassword(activeUser._id, hashedPassword);
};

const authServices = {
  registerUserService,
  loginUserService,
  forgotPasswordService,
  resetPasswordService,
};

export { authServices };
