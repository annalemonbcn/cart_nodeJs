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

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  let testAccount = await nodemailer.createTestAccount();

  // TODO: only for testing
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: "cart-node-js-back@gmail.com",
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
    <p>Please click on the following <a href="${resetURL}">link</a>, or paste this into your browser to complete the process:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  let info = await transporter.sendMail(mailOptions);
  return nodemailer.getTestMessageUrl(info);
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
