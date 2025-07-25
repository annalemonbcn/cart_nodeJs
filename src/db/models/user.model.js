import mongoose from "mongoose";
import { collectionNames } from "../constants/index.js";

const arrayLimit = (val) => val.length <= 5;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    lastName: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    phoneNumber: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionNames.cartsCollection,
      required: true,
    },
    addresses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: collectionNames.addressesCollection,
        },
      ],
      default: [],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model(collectionNames.usersCollection, userSchema);

export default UserModel;
