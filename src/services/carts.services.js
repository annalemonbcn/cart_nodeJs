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
  try {
    let query = CartModel.findById(cid);

    if (options.populate) {
      query = query.populate("products.product");
    }

    if (options.lean) {
      query = query.lean();
    }

    const cart = await query;
    if (!cart) return null;

    return cart;
  } catch (error) {
    throw new Error(`Error getting cart id ${cid}: ` + error.message);
  }
};

const addProductToCartService = async (cid, pid) => {
  try {
    const cart = await getCartService(cid);
    if (!cart) return null;

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
  } catch (error) {
    throw new Error(
      `Error adding product ${pid} to cart ${cid}: ` + error.message
    );
  }
};

const replaceProductsService = async (cid, products) => {
  try {
    const cart = await getCartService(cid);
    if (!cart) return null;

    cart.products = products;
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error(
      `Error replacing products for cart ${cid}: ` + error.message
    );
  }
};

const updateQuantityService = async (cid, pid, newQuantity) => {
  try {
    const cart = await getCartService(cid);
    if (!cart) throw new NotFoundError(`Cart with id ${cid} doesn't exist`);

    const productInCart = cart.products.find(
      ({ product }) => product.toString() === pid
    );
    if (!productInCart)
      throw new NotFoundError(
        `Cart with id ${cid} doesn't include product ${pid}`
      );

    productInCart.quantity = newQuantity;
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error(`Error updating product quantity: ` + error.message);
  }
};

const deleteCartService = async (cid) => {
  try {
    const deleted = await CartModel.findByIdAndDelete(cid);
    if (!deleted) return null;

    return deleted;
  } catch (error) {
    throw new Error(`Error deleting cart: ` + error.message);
  }
};

const deleteProductFromCartService = async (cid, pid) => {
  try {
    const cart = await getCartService(cid);
    if (!cart) throw new NotFoundError(`Cart with id ${cid} doesn't exist`);

    const productInCart = cart.products.find(
      ({ product }) => product.toString() === pid
    );
    if (!productInCart)
      throw new NotFoundError(
        `Cart with id ${cid} doesn't include product ${pid}`
      );

    cart.products = cart.products.filter(
      ({ product }) => product.toString() !== pid
    );
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error(
      `Error deleting product ${pid} from cart ${cid}: ` + error.message
    );
  }
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
