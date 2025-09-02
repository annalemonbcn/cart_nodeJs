import "dotenv-flow/config";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

const generateToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: "1h" });

export { generateToken };
