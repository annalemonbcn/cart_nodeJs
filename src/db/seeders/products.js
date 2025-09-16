import { faker } from "@faker-js/faker";
import ProductModel from "../models/product.model.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../config/db/index.js";
import { mockProducts } from "./mock.products.js";

await connectToDatabase();

const useMock = true;
const products = useMock ? mockProducts : [];

if (!useMock) {
  const brands = ["naikis", "adwidas", "poma", "rwebook"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const coloursList = ["black", "yellow", "pink", "red"];
  const categories = ["tops", "printed", "plain", "full-sleeve", "jeans"];

  for (let i = 0; i < 30; i++) {
    const features = {
      fabric: faker.helpers.arrayElement([
        "cotton",
        "polyester",
        "wool",
        "linen",
        "denim",
      ]),
      pattern: faker.helpers.arrayElement([
        "solid",
        "striped",
        "printed",
        "floral",
      ]),
      fit: faker.helpers.arrayElement(["regular", "slim", "loose"]),
      neck: faker.helpers.arrayElement(["round", "v-neck"]),
      sleeve: faker.helpers.arrayElement(["short", "long"]),
      style: faker.helpers.arrayElement([
        "classic",
        "casual",
        "business",
        "sport",
        "elegant",
        "formal",
      ]),
    };

    const productSizes = faker.helpers.arrayElements(
      sizes,
      faker.number.int({ min: 1, max: sizes.length })
    );

    const productColours = coloursList.map((c) => ({
      name: c,
      available: true,
    }));
    const randomIndex = faker.number.int({
      min: 0,
      max: coloursList.length - 1,
    });
    productColours[randomIndex].available = false;

    const thumbnails = Array.from(
      { length: faker.number.int({ min: 3, max: 5 }) },
      () => faker.image.url()
    );

    products.push({
      code: faker.commerce.isbn(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      brand: faker.helpers.arrayElement(brands),
      features,
      sizes: productSizes,
      colours: productColours,
      price: parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 2 })),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.helpers.arrayElement(categories),
      thumbnails,
    });
  }
}

ProductModel.insertMany(products)
  .then(() => console.log("Products added"))
  .then(async () => await disconnectFromDatabase());
