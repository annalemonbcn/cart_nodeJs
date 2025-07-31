import { productServices } from "#services/products.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  fetchProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = productServices;

const getAllProducts = async (req, res) => {
  const { docs, pageContext } = await fetchProductsService(req);

  return res.status(200).json({
    status: "success",
    code: 200,
    payload: docs,
    pageContext,
  });
};

const getProductById = async (req, res) => {
  const { pid } = req.params;
  if (!pid)
    throw new BadRequestError(
      "getProductById: Missing product id in request params"
    );

  const product = await getProductByIdService(pid);

  return res
    .status(200)
    .json({ status: "success", code: 200, payload: product });
};

const createProduct = async (req, res) => {
  const product = req.body;
  if (!product || Object.keys(product).length === 0)
    throw new BadRequestError("createProduct: Missing product in request body");

  const newProduct = await createProductService(product);

  return res.status(201).json({
    status: "success",
    code: 201,
    message: "Product successfully created",
    payload: newProduct,
  });
};

const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body;

  if (!pid || Object.keys(fieldsToUpdate).length === 0)
    throw new BadRequestError(
      "updateProduct: Missing product id or fieldsToUpdate property in request"
    );

  const updated = await updateProductService(pid, fieldsToUpdate);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Product updated successfully",
    payload: updated,
  });
};

const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  if (!pid)
    throw new BadRequestError(
      "deleteProduct: Missing product id in request params"
    );

  const deleted = await deleteProductService(pid);

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
};
