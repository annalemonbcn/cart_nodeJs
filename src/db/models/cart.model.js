import mongoose from "mongoose";
import { collectionNames } from "../constants/index.js";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
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
    ],
    required: true,
    default: [],
  },
});

const CartModel = mongoose.model(collectionNames.cartsCollection, cartSchema);

export default CartModel;
