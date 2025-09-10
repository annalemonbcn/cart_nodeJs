import ProductModel from "#models/product.model.js";

const getProductById = async (productId) => {
  const product = await ProductModel.findById(productId);
  return product;
};

const productDAO = {
  getProductById,
};

export { productDAO };