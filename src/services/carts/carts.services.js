import { cartDAO } from "#dao/cart/cart.dao.js";
import { productDAO } from "#dao/products/product.dao.js";
import { validateStock } from "./validations.js";

const createCartService = async (cartData) =>
  await cartDAO.createCart(cartData);

const addProductToCartService = async (cid, pid) => {
  const product = await productDAO.getProductById(pid);
  validateStock(1, product.stock);

  const updatedCart = await cartDAO.addProductToCart(cid, pid);
  return updatedCart;
};

const updateQuantityService = async (cid, pid, newQuantity) => {
  const product = await productDAO.getProductById(pid);
  validateStock(newQuantity, product.stock);

  const cart = await cartDAO.updateQuantity(cid, pid, newQuantity);
  return cart;
};

const replaceProductsService = async (cid, products) => {
  for (const product of products) {
    const productData = await productDAO.getProductById(product.product);
    validateStock(product.quantity, productData.stock);
  }

  const updatedCart = await cartDAO.replaceProducts(cid, products);
  return updatedCart;
};

const deleteProductFromCartService = async (cid, pid) => {
  const cart = await cartDAO.deleteProductFromCart(cid, pid);
  return cart;
};

const cartServices = {
  createCartService,
  addProductToCartService,
  replaceProductsService,
  updateQuantityService,
  deleteProductFromCartService,
};

export { cartServices };
