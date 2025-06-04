import fs from "fs/promises";

class ProductsManager {
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
      throw new Error(`Error at writeFile: ${error.message}`);
    }
  }

  #findProductIndexById(products, id) {
    return products.findIndex((product) => product.id === parseInt(id));
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
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    )
      throw new Error(
        "Incomplete request. All attributes are mandatory: title, description, code, price, status, stock, category and thumbnails"
      );

    const products = await this.#readData();

    if (this.#findProductByCode(products, code))
      throw new Error("Product code already exists");

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
      throw new Error(`Product couldn't be added to cart: ${error.message}`);
    }
  }

  async getProducts() {
    return await this.#readData();
  }

  async getProductById(productId) {
    const products = await this.#readData();
    const selectedProduct = products.find(
      (product) => parseInt(product.id) === parseInt(productId)
    );

    return selectedProduct ? selectedProduct : null;
  }

  async updateProduct(productId, updatedFields) {
    const products = await this.#readData();

    const index = this.#findProductIndexById(products, productId);

    if (index === -1)
      throw new Error(`Product with id ${productId} doesn't exist`);

    delete updatedFields.id;
    products[index] = { ...products[index], ...updatedFields };

    try {
      await this.#writeData(products);
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    const products = await this.#readData();

    const index = this.#findProductIndexById(products, productId);

    if (index === -1)
      throw new Error(`Product with id ${productId} doesn't exist`);

    products.splice(index, 1);

    try {
      await this.#writeData(products);
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

export default ProductsManager;
