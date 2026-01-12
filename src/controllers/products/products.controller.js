import { productServices } from "#services/products/products.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  fetchProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
  getFiltersService,
} = productServices;

const getAllProducts = async (req, res) => {
  const { docs, pageContext } = await fetchProductsService(req);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Products retrieved successfully",
    payload: docs,
    pageContext,
  });
};

const getProductById = async (req, res) =>
  res.status(200).json({
    status: "success",
    code: 200,
    message: "Product retrieved successfully",
    payload: req.product,
  });

const getFilters = async (req, res) => {
  const filters = await getFiltersService(req);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Filters retrieved successfully",
    payload: filters,
  });
};

const createProduct = async (req, res) => {
  const product = req.body;
  if (!product) throw new BadRequestError("Missing product in request body");

  const newProduct = await createProductService(product);

  return res.status(201).json({
    status: "success",
    code: 201,
    message: "Product successfully created",
    payload: newProduct,
  });
};

const updateProduct = async (req, res) => {
  const fieldsToUpdate = req.body;

  if (Object.keys(fieldsToUpdate).length === 0)
    throw new BadRequestError(
      "updateProduct: Missing fieldsToUpdate property in request"
    );

  const updated = await updateProductService(
    req.product._id.toString(),
    fieldsToUpdate
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Product updated successfully",
    payload: updated,
  });
};

const deleteProduct = async (req, res) => {
  const deleted = await deleteProductService(req.product._id.toString());

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Product deleted successfully",
    payload: deleted,
  });
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilters
};
