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

    if (Array.isArray(ret.products) && ret.products.length > 0) {
      ret.products = ret.products.map((product) => {
        // TODO: delete when implement toJSON to product
        if (product._id) {
          delete product._id;
        }

        if (product.product && product.product._id) {
          delete product.product._id;
        }

        return product;
      });
    }

    return ret;
  },
});

const CartModel = mongoose.model(collectionNames.cartsCollection, cartSchema);

export default CartModel;
