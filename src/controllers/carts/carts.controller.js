import { cartServices } from "#services/carts.services.js";
import { BadRequestError } from "#utils/errors.js";
import { validateProducts, validateQuantity } from "./validations.js";

const {
  createCartService,
  addProductToCartService,
  replaceProductsService,
  updateQuantityService,
  deleteProductFromCartService,
} = cartServices;

const createCart = async (req, res) => {
  const cart = {
    user: req.user.id,
    products: [],
  };

  const newCart = await createCartService(cart);

  return res.status(201).json({
    status: "success",
    code: 201,
    message: "Cart created successfully",
    payload: newCart.toJSON(),
  });
};

const getCartById = async (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    code: 200,
    payload: req.cart.toJSON(),
  });

const addProductToCart = async (req, res) => {
  const updatedCart = await addProductToCartService(
    req.cart._id.toString(),
    req.product._id.toString()
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Product ${req.product.id} added successfully to cart ${req.cart.id}`,
    payload: updatedCart.toJSON(),
  });
};

const updateProductQty = async (req, res) => {
  const body = req.body || {};
  const { quantity } = body;

  validateQuantity(quantity);

  const updatedCart = await updateQuantityService(
    req.cart._id.toString(),
    req.product._id.toString(),
    quantity
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Quantity updated to ${quantity} for product ${req.product.id} in cart ${req.cart.id}`,
    payload: updatedCart.toJSON(),
  });
};

const replaceProducts = async (req, res) => {
  const body = req.body || {};
  const { products } = body;

  await validateProducts(products);

  const updatedCart = await replaceProductsService(req.cart._id.toString(), products);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Cart ${req.cart.id} updated successfully`,
    payload: updatedCart.toJSON(),
  });
};

const deleteProductFromCart = async (req, res) => {
  const cart = await deleteProductFromCartService(
    req.cart._id.toString(),
    req.product._id.toString()
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Product ${req.product.id} successfully deleted from cart ${req.cart.id}`,
    payload: cart.toJSON(),
  });
};

export {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQty,
  replaceProducts,
  deleteProductFromCart,
};
