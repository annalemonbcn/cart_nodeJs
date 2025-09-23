import { userDAO } from "#dao/user/user.dao.js";
import { BadRequestError } from "#utils/errors.js";
import passport from "passport";
import { emailSchemaValidation } from "./validations.js";

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

const forgotPasswordService = (email) => {
  const { error } = emailSchemaValidation.validate({ email });
  if (error) throw new BadRequestError(error.details[0].message);

  const userExists = userDAO.getActiveUserByEmail(email);
  if(!userExists) throw new BadRequestError("User not found");
}

const authServices = {
  registerUserService,
  loginUserService,
  forgotPasswordService,
};

export { authServices };
