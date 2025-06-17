const path = require("path");
const ProductsManager = require("../managers/products.manager");
const productsFilePath = path.join(__dirname, "..", "data", "products.json");
const pm = new ProductsManager(productsFilePath);

exports.getAllProducts = async (req, res) => {
  const products = await pm.getProducts();
  res.status(200).json({ status: "success", code: 200, data: products });
};

exports.getProductById = async (req, res) => {
  const { pid } = req.params;
  const product = await pm.getProductById(pid);
  if (!product)
    return res
      .status(404)
      .json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

  res.status(200).json({ status: "success", code: 200, data: product });
};

exports.createProduct = async (req, res) => {
  const product = req.body;
  try {
    await pm.addProduct(product);
    res
      .status(201)
      .json({
        status: "success",
        code: 201,
        message: "Product created",
        data: product,
      });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", code: 400, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body;
  try {
    await pm.updateProduct(pid, fieldsToUpdate);
    res
      .status(200)
      .json({
        status: "success",
        code: 200,
        message: "Product updated successfully",
      });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", code: 400, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    await pm.deleteProduct(pid);
    res
      .status(200)
      .json({
        status: "success",
        code: 200,
        message: "Product deleted successfully",
      });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", code: 400, message: error.message });
  }
};
