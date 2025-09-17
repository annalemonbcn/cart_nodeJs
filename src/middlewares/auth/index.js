import passport from "passport";
import { ForbiddenError, UnauthorizedError } from "#utils/errors.js";

const validateRoles = (allowedRoles, userRole) => {
  const shouldValidateAllowedRoles = !!allowedRoles.length;
  if (!shouldValidateAllowedRoles) return;

  const isUserRoleInAllowedRoles = allowedRoles.includes(userRole);
  if (!isUserRoleInAllowedRoles)
    throw new ForbiddenError("Forbidden: Insufficient permissions");
};

const authenticateAndAuthorize =
  (...allowedRoles) =>
  (req, res, next) => {
    passport.authenticate("jwt-verify", { session: false }, (err, user) => {
      if (err || !user) return next(new UnauthorizedError("Unauthorized"));

      req.user = user;

      validateRoles(allowedRoles, user.role);

      next();
    })(req, res, next);
  };

export { authenticateAndAuthorize };
