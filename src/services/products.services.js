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
  try {
    const product = await ProductModel.findById(pid).lean();
    if (!product) return null;

    return product;
  } catch (error) {
    throw new Error(`Error getting product by id: ` + error.message);
  }
};

const createProductService = async (product) => {
  try {
    const newProduct = await ProductModel.create(product);
    return newProduct;
  } catch (error) {
    throw new Error(`Error creating a product: ` + error.message);
  }
};

const updateProductService = async (pid, fieldsToUpdate) => {
  try {
    const options = { new: true, runValidators: true };
    const updatedproduct = await ProductModel.findByIdAndUpdate(
      pid,
      fieldsToUpdate,
      options
    );

    if (!updatedproduct) return null;

    return updatedproduct;
  } catch (error) {
    throw new Error(`Error updating product ${pid}: ` + error.message);
  }
};

const deleteProductService = async (pid) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(pid);
    if (!deletedProduct) return null;

    return deletedProduct;
  } catch (error) {
    throw new Error(`Error deleting product ${pid}: ` + error.message);
  }
};

const productServices = {
  fetchProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};

export { productServices };
