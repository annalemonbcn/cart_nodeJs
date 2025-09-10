import mongoose from "mongoose";
import { collectionNames } from "../constants/index.js";

const productSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionNames.productsCollection,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionNames.usersCollection,
      required: true,
      unique: true,
    },
    products: {
      type: [productSchema],
      required: true,
      default: [],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { strict: true }
);

cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.user;

    return ret;
  },
});

const CartModel = mongoose.model(collectionNames.cartsCollection, cartSchema);

export default CartModel;
