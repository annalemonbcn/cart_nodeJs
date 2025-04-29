const fs = require("fs/promises");
const path = require("path");

class CartManager {
  constructor(pathToFile) {
    this.file = pathToFile;
  }

  async #readData() {
    try {
      const data = await fs.readFile(this.file, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw new Error("Error reading the file");
    }
  }

  async #writeData(data) {
    try {
      await fs.writeFile(this.file, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new error("Error at writeFile");
    }
  }

  #findCartIndexById(carts, id) {
    return carts.findIndex((cart) => cart.id === id);
  }

  async addCart() {
    const carts = await this.#readData();

    const newCart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };

    carts.push(newCart);

    try {
      await this.#writeData(carts);
    } catch (error) {
      console.error("Cart couldn't be created", error);
    }
  }

  async getCartById(cartId) {
    const carts = await this.#readData();
    const index = this.#findCartIndexById(carts, cartId);

    if (index === -1) {
      console.error(`Cart with id ${cartId} doesn't exist`);
      return;
    }

    return carts[index].products;
  }

  async addProductToCart(cartId, product) {
    const carts = await this.#readData();
    const index = this.#findCartIndexById(carts, parseInt(cartId));

    if (index === -1) {
      console.error(`Cart with id ${cartId} doesn't exist`);
      return;
    }

    const cart = carts[index];
    const productIndex = cart.products.findIndex(
      (item) => item.product === product.id
    );

    if (productIndex === -1) {
      cart.products.push({ product: product.id, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    try {
      await this.#writeData(carts);
      console.log(`Product ${product.id} added to cart ${cartId}`);
    } catch (error) {
      console.error("Failed to add product to cart", error);
    }
  }
}

module.exports = CartManager;
