import { faker } from "@faker-js/faker";
import ProductModel from "../models/product.model.js";
import { connectToDatabase, disconnectFromDatabase } from "../config/db/index.js";

await connectToDatabase();

const products = [];

for (let i = 0; i < 85; i++) {
  products.push({
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    code: faker.commerce.isbn(),
    price: faker.commerce.price(),
    status: faker.helpers.arrayElement(["in_stock", "out_of_stock"]),
    stock: faker.number.float({ min: 1, max: 100 }),
    category: faker.helpers.arrayElement([
      "electronics",
      "fashion",
      "home",
      "sports",
      "beauty",
      "games",
      "books",
      "music",
    ]),
    thumbnails: [{ url: faker.image.url() }],
  });
}

ProductModel.insertMany(products)
  .then(() => console.log("Products added"))
  .then(async () => await disconnectFromDatabase());