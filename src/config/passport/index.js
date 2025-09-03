import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import bcrypt from "bcrypt";
import "dotenv-flow/config";
import passportGoogle from "passport-google-oauth20";
import { AppError, BadRequestError, UnauthorizedError } from "#utils/errors.js";
import { userDAO } from "#dao/user/user.dao.js";
import {
  loginSchemaValidation,
  registerSchemaValidation,
} from "./validations.js";
import { cartDAO } from "#dao/cart/cart.dao.js";

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

          const { error } = registerSchemaValidation.validate({
            firstName,
            lastName,
            email: username,
            password,
          });
          if (error) throw new BadRequestError(error.details[0].message);

          const isUnique = await userDAO.isEmailUnique(username);
          if (!isUnique) return done(new AppError("Email already in use", 409));

          const user = await userDAO.createUser({
            firstName,
            lastName,
            email: username,
            password: bcrypt.hashSync(password, 10),
          });

          const cart = await cartDAO.createCart({
            user: user._id,
            products: [],
          });

          user.cart = cart._id;
          await user.save();

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

          const user = await userDAO.getActiveUserByEmail(username);
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

          let user = await userDAO.getActiveUserByGoogleId(googleId);

          // ? También podrías buscar por email para "vincular" cuentas si es el mismo usuario
          if (!user) {
            user = await userDAO.createUser({
              googleId,
              email,
              firstName,
              lastName,
              authProvider: "google",
            });

            const cart = await cartDAO.createCart({
              user: user._id,
              products: [],
            });

            user.cart = cart._id;
            await user.save();
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
