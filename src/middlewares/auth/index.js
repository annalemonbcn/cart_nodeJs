import passport from "passport";
import { ForbiddenError, UnauthorizedError } from "#utils/errors.js";

const authenticateAndAuthorize =
  (...allowedRoles) =>
  (req, res, next) => {
    passport.authenticate("jwt-verify", { session: false }, (err, user) => {
      if (err || !user) return next(new UnauthorizedError("Unauthorized"));

      req.user = user;

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return next(new ForbiddenError("Forbidden: Insufficient permissions"));
      }

      next();
    })(req, res, next);
  };

export { authenticateAndAuthorize };
