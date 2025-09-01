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
    phoneNumber: {
      type: String,
      default: undefined,
    },
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
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;

    if (Array.isArray(ret.addresses)) {
      ret.addresses = ret.addresses.map((addr) => {
        if (addr.deliveryAddress && addr.deliveryAddress._id) {
          delete addr.deliveryAddress._id;
        }

        return addr;
      });
    }

    return ret;
  },
});

const UserModel = mongoose.model(collectionNames.usersCollection, userSchema);

export default UserModel;
