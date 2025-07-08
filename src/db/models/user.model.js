import mongoose from "mongoose";
import { CARTS_COLLECTION } from "./cart.model.js";

const USERS_COLLECTION = "users";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: Number,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CARTS_COLLECTION,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model(USERS_COLLECTION, userSchema);

export default UserModel;

export { USERS_COLLECTION };
