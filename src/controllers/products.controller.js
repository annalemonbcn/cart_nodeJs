import ProductModel from "../db/models/product.model.js";
import { productServices } from "../services/products.services.js";

const {
  fetchProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = productServices;

const getAllProducts = async (req, res) => {
  try {
    const { docs, pageContext } = await fetchProductsService(req);

    return res.status(200).json({
      status: "success",
      code: 200,
      payload: docs,
      pageContext,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
};

const getProductById = async (req, res) => {
  const { pid } = req.params;

  if (!pid)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing product id in request params",
    });

  try {
    const product = await getProductByIdService(pid);

    if (!product)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

    return res
      .status(200)
      .json({ status: "success", code: 200, payload: product });
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const createProduct = async (req, res) => {
  const product = req.body;

  if (Object.keys(product).length === 0)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing product in request body",
    });

  try {
    const newProduct = await createProductService(product);

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Product successfully created",
      payload: newProduct,
    });
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body;

  if (!pid || Object.keys(fieldsToUpdate).length === 0)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing product id or fieldsToUpdate property in request",
    });

  try {
    const updated = await updateProductService(pid, fieldsToUpdate);

    if (!updated)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product updated successfully",
      payload: updated,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  if (!pid)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing product id in request params",
    });

  try {
    const deleted = await deleteProductService(pid);

    if (!deleted)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Product with id ${pid} doesn't exist`,
      });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product deleted successfully",
      payload: deleted,
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
