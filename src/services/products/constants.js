import { COLORS } from "../../db/constants/index.js";

const validFabric = [
  "cotton",
  "polyester",
  "wool",
  "linen",
  "denim",
  "leather",
];
const validPattern = ["solid", "striped", "printed", "floral"];
const validFit = ["regular", "slim", "loose"];
const validNeck = ["round", "v-neck"];
const validSleeve = ["short", "long"];
const validStyle = [
  "classic",
  "casual",
  "business",
  "sport",
  "elegant",
  "formal",
];
const validBrands = ["naikis", "adwidas", "poma", "rwebook"];
const validSizes = ["XS", "S", "M", "L", "XL"];
const validColours = COLORS;
const validCategories = [
  "tops",
  "t-shirts",
  "jeans",
  "shoes",
  "skirts",
  "dresses",
  "bags",
  "accessories",
];

export {
  validFabric,
  validPattern,
  validFit,
  validNeck,
  validSleeve,
  validStyle,
  validBrands,
  validSizes,
  validColours,
  validCategories,
};
