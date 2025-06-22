import { Router } from "express";
import bcrypt from "bcrypt";
import UserModel from "../../db/models/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).send({ error: "All fields are required" });

  // validate: valid email (contains @ or similar)

  // validate: unique email (find in db)

  // validate: strong password

  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    return res.status(201).send({
      status: "success",
      code: 201,
      message: "User successfully created",
      payload: user,
    });
  } catch (error) {
    console.error("Error in register:", error.message);
    return res
      .status(500)
      .send({ status: "error", code: 500, message: "Error creating user" });
  }
});

export default router;
