import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import bcrypt from "bcrypt";
import "dotenv-flow/config";
import UserModel from "#models/user.model.js";
import {
  validateEmail,
  validateUniqueEmail,
  validateStrongPassword,
} from "#utils/validations.js";

const SECRET = process.env.JWT_SECRET;

const startPassport = () => {
  passport.use(
    "register",
    new passportLocal.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { firstName, lastName } = req.body;

          if (!firstName || !lastName)
            return done(null, false, { message: "All fields are required" });

          if (!validateEmail(username))
            return done(null, false, { message: "Invalid email format" });

          const isUnique = await validateUniqueEmail(username);
          if (!isUnique)
            return done(null, false, { message: "Email already in use" });

          if (!validateStrongPassword(password))
            return done(null, false, {
              message:
                "Password must be at least 8 characters, include one uppercase letter and one special character",
            });

          const user = await UserModel.create({
            firstName,
            lastName,
            email: username,
            password: bcrypt.hashSync(password, 10),
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new passportLocal.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!validateEmail(username))
            return done(null, false, { message: "Invalid email format" });

          const user = await UserModel.findOne({ email: username }).lean();

          if (!user) return done(null, false, { message: "Unauthorized" });

          if (!bcrypt.compareSync(password, user.password))
            return done(null, false, { message: "Unauthorized" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new passportJWT.Strategy(
      {
        secretOrKey: SECRET,
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (user, done) => {
        try {
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export { startPassport };
