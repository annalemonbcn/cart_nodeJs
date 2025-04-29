const fs = require("fs/promises");
const path = require("path");

class CartManager {
  constructor(pathToFile) {
    this.file = pathToFile;
  }

  async #readData() {
    try {
      const carts = await fs.readFile(this.file, "utf-8");
      return JSON.parse(carts);
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

  async addCart(product) {
    // Get carts from db
    const carts = await this.#readData();

    // Create newCart + push it
    const newCart = {
      id: carts.length + 1,
      products: [],
    };

    carts.push(newCart);

    await this.#writeData(carts);
    console.log("Cart added");
  }

  async getCart(cartId) {
    const carts = await this.#readData();
    const selectedCart = carts.find(
      (cart) => parseInt(cart.id) === parseInt(cartId)
    );

    return selectedCart ? selectedCart : null;
  }

  async addProductToCart(cartId, product) {
    const selectedCart = await getCart(cartId);
    if (!selectedCart) return null;

    
  }
}

// const filePath = path.join(__dirname, "carts.json");
// const cm = new CartManager(filePath);

module.exports = CartManager;

// type Cart = {
//   id: number
//   products: []
// }
