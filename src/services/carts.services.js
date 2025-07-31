import CartModel from "../db/models/cart.model.js";
import { NotFoundError } from "../utils/errors.js";

const createCartService = async (cartData) => {
  try {
    const newCart = await CartModel.create(cartData);
    return newCart;
  } catch (error) {
    throw new Error("Error creating cart: " + error.message);
  }
};

const getCartService = async (cid, options = {}) => {
  let query = CartModel.findById(cid);

  if (options.populate) {
    query = query.populate("products.product");
  }

  if (options.lean) {
    query = query.lean();
  }

  const cart = await query;
  if (!cart)
    throw new NotFoundError(
      `getCartService: Cart with id ${cid} doesn't exist`
    );

  return cart;
};

const addProductToCartService = async (cid, pid) => {
  const cart = await getCartService(cid);
  if (!cart)
    throw new NotFoundError(
      `addProductToCartService: Cart with id ${cid} doesn't exist`
    );

  const productInCart = cart.products.find(
    ({ product }) => product.toString() === pid
  );

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();

  return cart;
};

const replaceProductsService = async (cid, products) => {
  const cart = await getCartService(cid);
  if (!cart)
    throw new NotFoundError(
      `replaceProductsService: Cart with id ${cid} doesn't exist`
    );

  cart.products = products;
  await cart.save();

  return cart;
};

const updateQuantityService = async (cid, pid, newQuantity) => {
  const cart = await getCartService(cid);
  if (!cart) throw new NotFoundError(`updateQuantityService: Cart with id ${cid} doesn't exist`);

  const productInCart = cart.products.find(
    ({ product }) => product.toString() === pid
  );
  if (!productInCart)
    throw new NotFoundError(
      `updateQuantityService: Cart with id ${cid} doesn't include product ${pid}`
    );

  productInCart.quantity = newQuantity;
  await cart.save();

  return cart;
};

const deleteCartService = async (cid) => {
  const deleted = await CartModel.findByIdAndDelete(cid);
  if (!deleted) throw new NotFoundError(`deleteCartService: Cart with id ${cid} doesn't exist`);

  return deleted;
};

const deleteProductFromCartService = async (cid, pid) => {
  const cart = await getCartService(cid);
  if (!cart) throw new NotFoundError(`deleteProductFromCartService: Cart with id ${cid} doesn't exist`);

  const productInCart = cart.products.find(
    ({ product }) => product.toString() === pid
  );
  if (!productInCart)
    throw new NotFoundError(
      `deleteProductFromCartService: Cart with id ${cid} doesn't include product ${pid}`
    );

  cart.products = cart.products.filter(
    ({ product }) => product.toString() !== pid
  );
  await cart.save();

  return cart;
};

const cartServices = {
  createCartService,
  getCartService,
  addProductToCartService,
  replaceProductsService,
  updateQuantityService,
  deleteCartService,
  deleteProductFromCartService,
};

export { cartServices };
