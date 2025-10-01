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
  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}&mode=reset`;

  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: "annalemonbcn.dev@gmail.com",
    to: user.email,
    subject: "Password Reset Request",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #8A33FD;">Reset Your Password</h2>
        <p>Hello ${user.firstName || ""},</p>
        <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" 
             style="background-color: #8A33FD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
  
        <p>If the button doesn’t work, copy and paste the following URL into your browser:</p>
        <p style="word-break: break-all;"><a href="${resetURL}" style="color: #8A33FD;">${resetURL}</a></p>
  
        <p>If you did not request a password reset, please ignore this email. Your account remains safe.</p>
  
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">© 2025 Anna Lemon BCN. All rights reserved.</p>
      </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
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
