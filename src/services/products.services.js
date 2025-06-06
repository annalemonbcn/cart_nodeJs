import ProductModel from "../models/product.model.js";
import { buildPaginationLinks } from "../utils/index.js";

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

  if (!page && !limit) {
    const products = await ProductModel.find(filter).sort(sortOption).lean();
    return {
      docs: products,
      pageContext: {
        totalPages: 1,
        prevPage: null,
        nextPage: null,
        hasPrevPage: false,
        hasNextPage: false,
        prevLink: null,
        nextLink: null,
      },
    };
  }

  const options = {
    page: parsedPage,
    limit: parsedLimit,
    lean: true,
    sort: sortOption,
  };

  const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } =
    await ProductModel.paginate(filter, options);

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
    docs: docs,
    pageContext: {
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
