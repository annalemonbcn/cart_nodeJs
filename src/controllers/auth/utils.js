import "dotenv-flow/config";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

const cleanUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.createdAt;
  delete userObj.updatedAt;
  delete userObj.__v;
  return userObj;
};

const generateToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: "1h" });

export { cleanUser, generateToken };
