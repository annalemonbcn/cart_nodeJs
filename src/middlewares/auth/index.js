import passport from "passport";
import { UnauthorizedError } from "#utils/errors.js";

const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt-verify", { session: false }, (err, user) => {
    if (err || !user) throw new UnauthorizedError("Unauthorized");

    req.user = user;

    next();
  })(req, res, next);
};

export { authenticateJwt };
