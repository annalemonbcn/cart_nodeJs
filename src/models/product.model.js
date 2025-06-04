import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["in_stock", "out_of_stock"],
    default: "in_stock",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "electronics",
      "fashion",
      "home",
      "sports",
      "beauty",
      "games",
      "books",
      "music",
    ],
    required: true,
  },
  thumbnails: {
    type: [
      {
        url: {
          type: String,
        },
      },
    ],
    default: [],
    required: true,
  },
});

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
