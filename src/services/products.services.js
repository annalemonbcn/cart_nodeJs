import ProductModel from "../db/models/product.model.js";
import { buildPaginationLinks } from "../helpers/index.js";

const fetchProducts = async (req) => {
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

const productServices = {
  fetchProducts,
};

export { productServices };
