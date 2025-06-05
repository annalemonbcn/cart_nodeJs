import { faker } from "@faker-js/faker";
import CartModel from "../models/cart.model.js";
import { connectToDatabase, disconnectFromDatabase } from "../config/db.js";

await connectToDatabase();

const carts = [];
const cart1 = {
  products: [
    "684140f1d24a9453832e6f7c",
    "684140f1d24a9453832e6f7e",
    "684140f1d24a9453832e6f80",
  ],
};

const cart2 = {
  products: ["684140f1d24a9453832e6f82"],
};

const cart3 = {
  products: ["684140f1d24a9453832e6f84", "684140f1d24a9453832e6f86"],
};

carts.push(cart1);

CartModel.insertMany(carts)
  .then(() => console.log("Products added"))
  .then(async () => await disconnectFromDatabase());
