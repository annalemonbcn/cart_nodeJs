// TODO: delete ?
import fs from "fs/promises";

class CartsManager {
  constructor(pathToFile) {
    this.file = pathToFile;
  }

  async #readData() {
    try {
      const data = await fs.readFile(this.file, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw new Error(`Error reading the file: ${error.message}`);
    }
  }

  async #writeData(data) {
    try {
      await fs.writeFile(this.file, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new error(`Error at writeFile: ${error.message}`);
    }
  }

  #findCartIndexById(carts, id) {
    return carts.findIndex((cart) => cart.id === parseInt(id));
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
      throw new Error(`Cart couldn't be created: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    const carts = await this.#readData();
    const index = this.#findCartIndexById(carts, cartId);

    if (index === -1) throw new Error(`Cart with id ${cartId} doesn't exist`);

    return carts[index].products;
  }

  async addProductToCart(cartId, product) {
    const carts = await this.#readData();
    const index = this.#findCartIndexById(carts, cartId);

    if (index === -1) throw new Error(`Cart with id ${cartId} doesn't exist`);

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
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  }
}

export default CartsManager;
