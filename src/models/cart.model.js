import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: Array,
    required: true,
    default: [],
  },
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
