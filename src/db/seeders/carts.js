import CartModel from "../models/cart.model.js";
import { connectToDatabase, disconnectFromDatabase } from "../config/index.js";

await connectToDatabase();

const carts = [];
const cart1 = {
  products: [
    { product: "685182032027309eda91170f", quantity: 2 },
    { product: "685182032027309eda91170f", quantity: 1 },
    { product: "685182032027309eda911711", quantity: 5 },
  ],
};

const cart2 = {
  products: [{ product: "685182032027309eda911711", quantity: 8 }],
};

const cart3 = {
  products: [
    { product: "685182032027309eda911713", quantity: 3 },
    { product: "685182032027309eda911713", quantity: 4 },
  ],
};

carts.push(cart3);

CartModel.insertMany([cart1, cart2, cart3])
  .then(() => console.log("Carts added"))
  .then(async () => await disconnectFromDatabase());