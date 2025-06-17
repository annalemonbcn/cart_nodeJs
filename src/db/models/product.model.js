import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PRODUCTS_COLLECTION = "products";

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

productSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model(PRODUCTS_COLLECTION, productSchema);

export default ProductModel;

export { PRODUCTS_COLLECTION };