import mongoose from "mongoose";

const USERS_COLLECTION = "users";

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
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model(USERS_COLLECTION, userSchema);

export default UserModel;

export { USERS_COLLECTION };
