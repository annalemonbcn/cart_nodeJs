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
import { getRawFilterId, toUpper } from "./helpers.js";

const fetchProductsService = async (req) => {
  const {
    page,
    limit,
    category,
    color,
    size,
    brand,
    minPrice,
    maxPrice,
    gender,
  } = req.query;

  const categoryArr = parseParamsList(category);
  const colorArr = parseParamsList(color);
  const sizeArr = parseParamsList(size, toUpper);
  const brandArr = parseParamsList(brand);

  const filter = {};
  if (categoryArr) filter.categories = { $in: categoryArr };
  if (colorArr) filter.colors = { $in: colorArr };
  if (sizeArr) filter.sizes = { $in: sizeArr };
  if (brandArr) filter.brand = { $in: brandArr };
  if (gender) filter.gender = gender;

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

const getFiltersService = async (req) => {
  const { gender } = req.query;

  const filterBase = {};
  if (gender) filterBase.gender = gender;

  const raw = await productDAO.getFilters(filterBase);

  return {
    categories: getRawFilterId(raw.categories),
    brands: getRawFilterId(raw.brand),
    colors: getRawFilterId(raw.colors),
    sizes: getRawFilterId(raw.sizes),
    prices:
      raw.prices && raw.prices[0]
        ? {
            min: raw.prices[0].min,
            max: raw.prices[0].max,
          }
        : null,
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
  getFiltersService,
};

export { productServices };
