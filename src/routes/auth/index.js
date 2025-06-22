import { Router } from "express";
import bcrypt from "bcrypt";
import UserModel from "../../db/models/user.model.js";

const router = Router();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const validateUniqueEmail = async (email) => {
  const existingUser = await UserModel.findOne({ email });
  return !existingUser;
};

const validateStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]{8,}$/;

  return passwordRegex.test(password);
};

router.post("/register", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  /** Validations */
  if (!firstName || !lastName || !email || !password)
    return res
      .status(400)
      .send({ status: "error", code: 400, message: "All fields are required" });

  // validate: valid email (contains @ or similar)
  if (!validateEmail(email))
    return res
      .status(400)
      .send({ status: "error", code: 400, message: "Invalid email format" });

  // validate: unique email (find in db)
  const isUnique = await validateUniqueEmail(email);
  if (!isUnique)
    return res
      .status(409)
      .send({ status: "error", code: 409, message: "Email already in use" });

  // validate: strong password
  if (!validateStrongPassword(password))
    return res.status(400).send({
      status: "error",
      code: 400,
      message:
        "Password must be at least 8 characters, include one uppercase letter and one special character",
    });

  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const userObj = user.toObject(); // -> toObject() is used to convert a plain object instead of a mongoose document
    delete userObj.password;
    delete userObj.createdAt;
    delete userObj.updatedAt;

    // Remove sensible data
    return res.status(201).send({
      status: "success",
      code: 201,
      message: "User successfully created",
      payload: userObj,
    });
  } catch (error) {
    console.error("Error in register:", error.message);
    return res
      .status(500)
      .send({ status: "error", code: 500, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  /** Validations */
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", code: 400, message: "All fields are required" });

  // validate: valid email (contains @ or similar)
  if (!validateEmail(email))
    return res
      .status(400)
      .send({ status: "error", code: 400, message: "Invalid email format" });

  // validate: strong password
  if (!validateStrongPassword(password))
    return res.status(400).send({
      status: "error",
      code: 400,
      message:
        "Password must be at least 8 characters, include one uppercase letter and one special character",
    });

  try {
    const user = await UserModel.findOne({ email }).lean(); // -> lean is used to return a plain object, not a mongoose document

    // Validate: user exists in db
    if (!user)
      return res
        .status(401)
        .send({ status: "error", code: 401, message: "Unauthorized" });

    // Validate: email matches password hash
    if (!bcrypt.compareSync(password, user.password))
      return res
        .status(401)
        .send({ status: "error", code: 401, message: "Unauthorized" });

    // Remove sensible data
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    return res.status(200).send({
      status: "success",
      code: 200,
      message: "User successfully logged in",
      payload: user, // -> return a JWT token, not user
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    return res
      .status(500)
      .send({ status: "error", code: 500, message: "Internal server error" });
  }
});

export default router;
