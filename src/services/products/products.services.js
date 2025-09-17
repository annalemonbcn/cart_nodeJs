import { productDAO } from "#dao/products/product.dao.js";
import { BadRequestError } from "#utils/errors.js";
import { buildPaginationLinks } from "../../helpers/index.js";
import {
  productSchemaValidation,
  updateProductSchemaValidation,
} from "./validations.js";

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
  } = await productDAO.get(filter, options);

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
      totalDocs: docs.length,
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
