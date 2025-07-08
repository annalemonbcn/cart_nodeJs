import "dotenv-flow/config";
import passport from "passport";

const authenticateJwt = (req, res, next) => {
  passport.authenticate("current", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};

export { authenticateJwt };
