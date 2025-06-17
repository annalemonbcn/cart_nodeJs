import ProductModel from "../db/models/product.model.js";
import { productServices } from "../services/products.services.js";

const getAllProducts = async (req, res) => {
  const { fetchProducts } = productServices;

  try {
    const { docs, pageContext } = await fetchProducts(req);

    res.status(200).json({
      status: "success",
      code: 200,
      payload: docs,
      pageContext,
    });
  } catch (error) {
    console.error("Error while getAllProducts:", error.message);
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await ProductModel.findById(pid).lean();

    if (!product)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

    res.status(200).json({ status: "success", code: 200, payload: product });
  } catch (error) {
    console.error("Error while getProductById:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const createProduct = async (req, res) => {
  const product = req.body;

  try {
    const newProduct = await ProductModel.create(product);
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Product successfully created",
      payload: newProduct,
    });
  } catch (error) {
    console.error("Error while createProduct:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body;

  try {
    const updated = await ProductModel.findByIdAndUpdate(pid, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Product updated successfully",
      payload: updated,
    });
  } catch (error) {
    console.error("Error while updateProduct:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const deleted = await ProductModel.findByIdAndDelete(pid);

    if (!deleted)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Product deleted successfully",
      payload: deleted,
    });
  } catch (error) {
    console.error("Error while deleteProduct:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
