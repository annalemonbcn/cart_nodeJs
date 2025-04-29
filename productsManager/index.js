const fs = require("fs").promises;
const path = require("path");
const mockProducts = require("./mockData");

class ProductManager {
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

  async addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) {
    const products = await this.#readData();

    const productExists = products.find((product) => product.code === code);

    if (productExists) {
      console.error("Product code already exists");
      return;
    }

    const newProduct = {
      id: products.length + 1,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);

    try {
      await this.#writeData(products);
    } catch (error) {
      console.error("Product couldn't be added to cart", error);
    }
  }

  async getProducts() {
    return await this.#readData();
  }

  async getProductById(productId) {
    const products = await this.#readData();
    const selectedProduct = products.find(
      (product) => product.id === productId
    );

    return selectedProduct
      ? selectedProduct
      : console.error(`Product with id ${productId} doesn't exist`);
  }
}

const pathFile = path.join(__dirname, "products.json");
const pm = new ProductManager(pathFile);

// mockProducts.map((product) => pm.addProduct(product));
// pm.addProduct({
//   title: "Mochila Hidratación 10L",
//   description: "Mochila compacta con bolsa de hidratación incluida.",
//   code: "MOCH-010",
//   price: 54.95,
//   status: true,
//   stock: 35,
//   category: "Accesorios",
//   thumbnails: "https://example.com/images/mochila-010.jpg",
// });

// pm.getProducts().then((data) => console.log("products", data));

// pm.getProductById(3).then((data) => console.log('product', data));

module.exports = ProductManager;
