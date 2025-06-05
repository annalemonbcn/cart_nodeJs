import { faker } from "@faker-js/faker";
import CartModel from "../models/cart.model.js";
import { connectToDatabase, disconnectFromDatabase } from "../config/db.js";

await connectToDatabase();

const carts = [];
const cart1 = {
  products: [
    { productId: "684140f1d24a9453832e6f7c", quantity: 2 },
    { productId: "684140f1d24a9453832e6f7e", quantity: 1 },
    { productId: "684140f1d24a9453832e6f80", quantity: 5 },
  ],
};

const cart2 = {
  products: [{ productId: "684140f1d24a9453832e6f82", quantity: 8 }],
};

const cart3 = {
  products: [
    { productId: "684140f1d24a9453832e6f84", quantity: 3 },
    { productId: "684140f1d24a9453832e6f86", quantity: 4 },
  ],
};

carts.push(cart3);

CartModel.insertMany([cart1, cart2, cart3])
  .then(() => console.log("Cart added"))
  .then(async () => await disconnectFromDatabase());
