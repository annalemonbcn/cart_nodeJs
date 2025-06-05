import ProductModel from "../models/product.model.js";
import { buildPaginationLinks } from "../utils/index.js";

const getAllProducts = async (req, res) => {
  try {
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
      return res.status(200).json({
        status: "success",
        code: 200,
        payload: products,
        pageContext: {
          totalPages: 1,
          prevPage: null,
          nextPage: null,
          hasPrevPage: false,
          hasNextPage: false,
          prevLink: null,
          nextLink: null,
        },
      });
    }

    const options = {
      page: parsedPage,
      limit: parsedLimit,
      lean: true,
      sort: sortOption,
    };

    const result = await ProductModel.paginate(filter, options);
    const { totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

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

    res.status(200).json({
      status: "success",
      code: 200,
      payload: result,
      pageContext: {
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      },
    });
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
