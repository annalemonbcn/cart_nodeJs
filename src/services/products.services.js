import { NotFoundError } from "#utils/errors.js";
import ProductModel from "../db/models/product.model.js";
import { buildPaginationLinks } from "../helpers/index.js";

const fetchProductsService = async (req) => {
  const { page, limit, query, sort } = req.query;

  let filter = {};
  if (query) {
    const [key, value] = query.split(":");
    if (["category", "status"].includes(key)) {
      filter[key] = value;
    }
  }

  let sortOption = {};
  if (sort === "asc") sortOption.price = 1;
  else if (sort === "desc") sortOption.price = -1;

  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  const options = {
    page: parsedPage,
    limit: parsedLimit,
    lean: true,
    sort: sortOption,
  };

  const {
    docs,
    page: currentPage,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
  } = await ProductModel.paginate(filter, options);

  const { prevLink, nextLink } = buildPaginationLinks(
    req,
    query,
    sort,
    parsedLimit,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage
  );

  return {
    docs,
    pageContext: {
      page: currentPage,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    },
  };
};

const getProductByIdService = async (pid) => {
  const product = await ProductModel.findById(pid).lean();
  if (!product)
    throw new NotFoundError(
      `getProductByIdService: Product with id ${pid} doesn't exist`
    );

  return product;
};

const createProductService = async (product) => {
  const newProduct = await ProductModel.create(product);
  return newProduct;
};

const updateProductService = async (pid, fieldsToUpdate) => {
  const options = { new: true, runValidators: true };
  const updatedproduct = await ProductModel.findByIdAndUpdate(
    pid,
    fieldsToUpdate,
    options
  );

  if (!updatedproduct)
    throw new NotFoundError(
      `updateProductService: Product with id ${pid} doesn't exist`
    );

  return updatedproduct;
};

const deleteProductService = async (pid) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(pid);
  if (!deletedProduct)
    throw new NotFoundError(
      `deleteProductService:Product with id ${pid} doesn't exist`
    );

  return deletedProduct;
};

const productServices = {
  fetchProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};

export { productServices };
