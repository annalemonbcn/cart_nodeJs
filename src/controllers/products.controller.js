import ProductModel from "../models/product.model.js";

const getAllProducts = async (_req, res) => {
  try {
    const products = await ProductModel.find().lean();
    res.status(200).json({ status: "success", code: 200, data: products });
  } catch (error) {
    console.error("Error while getAllProducts:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
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

    res.status(200).json({ status: "success", code: 200, data: product });
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
      data: newProduct,
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
      data: updated,
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
      data: deleted,
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
