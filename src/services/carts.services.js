import { cartDAO } from "#dao/cart/cart.dao.js";
import { NotFoundError } from "../utils/errors.js";

const createCartService = async (cartData) =>
  await cartDAO.createCart(cartData);

const addProductToCartService = async (cid, pid) => {
  const updatedCart = await cartDAO.addProductToCart(cid, pid);
  if (!updatedCart)
    throw new NotFoundError(`Cart with id ${cid} doesn't exist`);

  return updatedCart;
};

const updateQuantityService = async (cid, pid, newQuantity) => {
  const cart = await cartDAO.updateQuantity(cid, pid, newQuantity);
  if (!cart) throw new NotFoundError(`Cart with id ${cid} doesn't exist`);

  return cart;
};

const replaceProductsService = async (cid, products) => {
  const updatedCart = await cartDAO.replaceProducts(cid, products);
  if (!updatedCart)
    throw new NotFoundError(`Cart with id ${cid} doesn't exist`);

  return updatedCart;
};

const deleteProductFromCartService = async (cid, pid) => {
  const cart = await cartDAO.deleteProductFromCart(cid, pid);
  if (!cart) throw new NotFoundError(`Cart with id ${cid} doesn't exist`);

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
