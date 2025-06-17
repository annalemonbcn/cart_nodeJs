import mongoose from "mongoose";
import { PRODUCTS_COLLECTION } from "./product.model.js";

const CARTS_COLLECTION = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: PRODUCTS_COLLECTION,
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

const CartModel = mongoose.model(CARTS_COLLECTION, cartSchema);

export default CartModel;

export { CARTS_COLLECTION };
