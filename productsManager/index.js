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

  #findProductIndexById(products, id) {
    return products.findIndex((product) => product.id === id);
  }

  #findProductByCode(products, code) {
    return products.find((product) => product.code === code);
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

    if (this.#findProductByCode(products, code)) {
      console.error("Product already exists");
      return;
    }

    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
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

  async updateProduct(productId, updatedFields) {
    const products = await this.#readData();

    const index = this.#findProductIndexById(products, productId);

    if (index === -1) {
      console.error(`Product with id ${productId} doesn't exist`);
      return;
    }

    delete updatedFields.id;
    products[index] = { ...products[index], ...updatedFields };

    try {
      await this.#writeData(products);
      console.log(`Product with id ${productId} updated successfully`);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  }

  async deleteProduct(productId) {
    const products = await this.#readData();

    const index = this.#findProductIndexById(products, productId);

    if (index === -1) {
      console.error(`Product with id ${productId} doesn't exist`);
      return;
    }

    products.splice(index, 1);

    try {
      await this.#writeData(products);
      console.log(`Product with id ${productId} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  }
}

const pathFile = path.join(__dirname, "products.json");
const pm = new ProductManager(pathFile);

// pm.addProduct({
//   title: "Chaqueta Impermeable Ligera",
//   description:
//     "Chaqueta cortavientos y resistente al agua, ideal para el trail.",
//   code: "CHAQ-200",
//   price: 119.5,
//   status: true,
//   stock: 20,
//   category: "Ropa",
//   thumbnails: "https://example.com/images/chaqueta-200.jpg",
// });

// pm.getProductById(2).then((data) => console.log('product', data));

// pm.updateProduct(2, {
//   price: 79.99,
//   stock: 15,
//   status: false,
// });

// pm.deleteProduct(3);

// pm.getProducts().then((data) => console.log("products", data));

module.exports = ProductManager;
