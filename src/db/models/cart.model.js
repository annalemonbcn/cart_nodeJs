import mongoose from "mongoose";
import { collectionNames, modelNames } from "../constants/index.js";

const productSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.productModel,
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
      ref: modelNames.userModel,
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
  { strict: true, collection: collectionNames.cartsCollection }
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

const CartModel =
  mongoose.models[modelNames.cartModel] ||
  mongoose.model(modelNames.cartModel, cartSchema);

export default CartModel;
