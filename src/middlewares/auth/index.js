import jwt from "jsonwebtoken";
import "dotenv-flow/config";

const SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
    });

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
  } catch (error) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
    });
  }

  next();
};

export { auth };
