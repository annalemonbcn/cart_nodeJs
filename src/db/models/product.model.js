import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { collectionNames } from "../constants/index.js";

const featuresSchema = new mongoose.Schema({
  fabric: {
    type: String,
    enum: ["cotton", "polyester", "wool", "linen", "denim", "leather"],
    required: true,
  },
  pattern: {
    type: String,
    enum: ["solid", "striped", "printed", "floral"],
    required: true,
  },
  fit: {
    type: String,
    enum: ["regular", "slim", "loose"],
    required: true,
  },
  neck: {
    type: String,
    enum: ["round", "v-neck"],
    required: true,
  },
  sleeve: {
    type: String,
    enum: ["short", "long"],
    required: true,
  },
  style: {
    type: String,
    enum: ["classic", "casual", "business", "sport", "elegant", "formal"],
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    enum: ["naikis", "adwidas", "poma", "rwebook"],
    required: true,
  },
  features: {
    type: featuresSchema,
    required: true,
  },
  sizes: {
    type: [String],
    enum: ["XS", "S", "M", "L", "XL"],
    default: [],
    required: true,
  },
  colours: {
    type: [
      {
        name: {
          type: String,
          enum: [
            "purple",
            "black",
            "red",
            "orange",
            "navy",
            "white",
            "broom",
            "green",
            "yellow",
            "grey",
            "pink",
            "blue",
          ],
        },
        available: {
          type: Boolean,
          default: true,
        },
      },
    ],
    default: [
      { name: "purple", available: false },
      { name: "black", available: false },
      { name: "red", available: false },
      { name: "orange", available: false },
      { name: "navy", available: false },
      { name: "white", available: false },
      { name: "broom", available: false },
      { name: "green", available: false },
      { name: "yellow", available: false },
      { name: "grey", available: false },
      { name: "pink", available: false },
      { name: "blue", available: false },
    ],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  categories: {
    type: [String],
    enum: [
      "tops",
      "t-shirts",
      "jeans",
      "shoes",
      "skirts",
      "dresses",
      "bags",
      "accessories",
    ],
    required: true,
  },
  thumbnails: {
    type: [String],
    default: [],
    required: true,
  },
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;

    if (ret.features && typeof ret.features === "object") {
      delete ret.features._id;
      delete ret.features.id;
    }

    if (Array.isArray(ret.colours)) {
      ret.colours = ret.colours.map((colour) => {
        const { _id, id, ...rest } = colour;
        return rest;
      });
    }

    return ret;
  },
});

productSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model(
  collectionNames.productsCollection,
  productSchema
);

export default ProductModel;
