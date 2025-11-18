import { productDAO } from "#dao/products/product.dao.js";
import { BadRequestError } from "#utils/errors.js";
import {
  parseParamsList,
  buildPriceFilter,
  parsePagination,
  buildPaginationLinks,
} from "./utils.js";
import {
  productSchemaValidation,
  updateProductSchemaValidation,
} from "./validations.js";
import { toUpper } from "./helpers.js";

const fetchProductsService = async (req) => {
  const { page, limit, category, color, size, brand, minPrice, maxPrice } =
    req.query;

  const categoryArr = parseParamsList(category);
  const colorArr = parseParamsList(color);
  const sizeArr = parseParamsList(size, toUpper);
  const brandArr = parseParamsList(brand);

  const filter = {};
  if (categoryArr) filter.categories = { $in: categoryArr };
  if (colorArr) filter.colors = { $in: colorArr };
  if (sizeArr) filter.sizes = { $in: sizeArr };
  if (brandArr) filter.brand = { $in: brandArr };

  const price = buildPriceFilter(minPrice, maxPrice);
  if (price) filter.price = price;

  const { page: parsedPage, limit: parsedLimit } = parsePagination({
    page,
    limit,
  });

  const result = await productDAO.get(filter, {
    page: parsedPage,
    limit: parsedLimit,
  });

  const {
    docs,
    page: currentPage,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    totalDocs,
  } = result;

  const { prevLink, nextLink } = buildPaginationLinks(req, {
    page: currentPage,
    limit: parsedLimit,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
  });

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
      totalDocs,
      limit: parsedLimit,
    },
  };
};

const createProductService = async (product) => {
  const { error } = productSchemaValidation.validate(product);
  if (error) throw new BadRequestError(error.details[0].message);

  return await productDAO.save(product);
};

const updateProductService = async (pid, fieldsToUpdate) => {
  const { error } = updateProductSchemaValidation.validate(fieldsToUpdate);
  if (error) throw new BadRequestError(error.details[0].message);

  return await productDAO.update(pid, fieldsToUpdate);
};

const deleteProductService = async (pid) => await productDAO.delete(pid);

const productServices = {
  fetchProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
};

export { productServices };
