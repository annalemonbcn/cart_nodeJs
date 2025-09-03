import CartModel from "#models/cart.model.js";
import { NotFoundError } from "#utils/errors.js";

const createCart = async (cartData, options = {}) => {
  const carts = await CartModel.create([cartData], options);
  return carts[0];
};

const getCartById = async (cartId) =>
  await CartModel.findById(cartId).populate("products.product");

const findProductInCart = (cart, productId) =>
  cart.products.find(({ product }) => product._id.toString() === productId);

const addProductToCart = async (cartId, productId) => {
  const cart = await getCartById(cartId);

  const productInCart = findProductInCart(cart, productId);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }

  await cart.save();

  return cart;
};

const updateQuantity = async (cartId, productId, quantity) => {
  const cart = await getCartById(cartId);

  const productInCart = findProductInCart(cart, productId);
  if (!productInCart) {
    throw new NotFoundError(
      `Product with id ${productId} doesn't exist in cart ${cartId}`
    );
  }

  productInCart.quantity = quantity;
  await cart.save();

  return cart;
};

const replaceProducts = async (cartId, products) => {
  const cart = await getCartById(cartId);

  cart.products = products;
  await cart.save();

  return cart;
};

const deleteProductFromCart = async (cartId, productId) => {
  const cart = await getCartById(cartId);

  const productInCart = findProductInCart(cart, productId);
  if (!productInCart) {
    throw new NotFoundError(
      `Product with id ${productId} doesn't exist in cart ${cartId}`
    );
  }

  cart.products = cart.products.filter(
    ({ product }) => product.toString() !== productId
  );
  await cart.save();

  return cart;
};

const softDelete = async (cartId, options = {}) =>
  await CartModel.findByIdAndUpdate(cartId, { deletedAt: new Date() }, options);

const hardDelete = async (cartId, options = {}) =>
  await CartModel.findByIdAndDelete(cartId, options);

const cartDAO = {
  createCart,
  getCartById,
  addProductToCart,
  replaceProducts,
  updateQuantity,
  deleteProductFromCart,
  softDelete,
  hardDelete,
};

export { cartDAO };
