import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import bcrypt from "bcrypt";
import "dotenv-flow/config";
import UserModel from "#models/user.model.js";
import passportGoogle from "passport-google-oauth20";
import { AppError, BadRequestError, UnauthorizedError } from "#utils/errors.js";
import { userDAO } from "#dao/user/user.dao.js";
import {
  loginSchemaValidation,
  registerSchemaValidation,
} from "./validations.js";

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
        console.log("req.body", req.body);
        try {
          let { firstName, lastName } = req.body;

          const { error } = registerSchemaValidation.validate({
            firstName,
            lastName,
            email: username,
            password,
          });
          if (error) throw new BadRequestError(error.details[0].message);

          const isUnique = await userDAO.isEmailUnique(username);
          if (!isUnique)
            return done(new AppError("register: Email already in use", 409));

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
          const { error } = loginSchemaValidation.validate({
            email: username,
            password,
          });
          if (error) throw new BadRequestError(error.details[0].message);

          const user = await UserModel.findOne({ email: username }).lean();
          if (!user || !bcrypt.compareSync(password, user.password))
            return done(
              new UnauthorizedError("login: Email or password is incorrect")
            );

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt-verify",
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

  passport.use(
    "google",
    new passportGoogle.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const [firstName, ...lastNameParts] = profile.displayName.split(" ");
          const lastName = lastNameParts.join(" ");

          let user = await UserModel.findOne({ googleId });

          // ? También podrías buscar por email para "vincular" cuentas si es el mismo usuario
          if (!user) {
            user = await UserModel.create({
              googleId,
              email,
              firstName,
              lastName,
              authProvider: "google",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

export { startPassport };
