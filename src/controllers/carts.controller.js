import CartModel from "../db/models/cart.model.js";
import { cartServices } from "../services/carts.services.js";

const {
  createCartService,
  getCartService,
  addProductToCartService,
  replaceProductsService,
  updateQuantityService,
  deleteCartService,
  deleteProductFromCartService,
} = cartServices;

const createCart = async (req, res) => {
  const cart = {
    products: [],
  };

  try {
    const newCart = await createCartService(cart);

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Cart created successfully",
      payload: newCart,
    });
  } catch (error) {
    console.error("Error in createCart:", error.message);

    return res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const getCartById = async (req, res) => {
  const { cid } = req.params;

  if (!cid)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing cart id in request params",
    });

  try {
    const cart = await getCartService(cid, { populate: true, lean: true });

    if (!cart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    return res
      .status(200)
      .json({ status: "success", code: 200, payload: cart });
  } catch (error) {
    console.error("Error in getCartById:", error.message);

    return res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!cid || !pid) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing cart id or product id in request params",
    });
  }

  try {
    const updatedCart = await addProductToCartService(cid, pid);

    if (!updatedCart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: `Product ${pid} added successfully to cart ${cid}`,
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error in addProductToCart:", error.message);

    return res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const replaceProducts = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!cid || Object.keys(products).length === 0) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing cart id or products in request params",
    });
  }

  try {
    const updatedCart = await replaceProductsService(cid, products);

    if (!updatedCart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: `Cart ${cid} updated successfully`,
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error in replaceProducts:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const updateProductQty = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!cid || !pid || !quantity)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing cart id, or product id, or quantity in request",
    });

  try {
    const updatedCart = await updateQuantityService(cid, pid, quantity);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: `Quantity updated to ${quantity} for product ${pid} in cart ${cid}`,
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error in updateProductQty:", error.message);

    const statusCode = error.statusCode || 500;

    return res
      .status(statusCode)
      .json({ status: "error", code: statusCode, message: error.message });
  }
};

const deleteCart = async (req, res) => {
  const { cid } = req.params;

  if (!cid)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing cart id in request params",
    });

  try {
    const deleted = await deleteCartService(cid);

    if (!deleted)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: `Cart ${cid} has been successfully deleted`,
    });
  } catch (error) {
    console.error("Error in deleteCart:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!cid || !pid)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing cart id or product id in request params",
    });

  try {
    const cart = await deleteProductFromCartService(cid, pid);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: `Product ${pid} successfully deleted from cart ${cid}`,
      payload: cart,
    });
  } catch (error) {
    console.error("Error in deleteProductFromCart:", error.message);

    const statusCode = error.statusCode || 500;

    return res
      .status(statusCode)
      .json({ status: "error", code: statusCode, message: error.message });
  }
};

export {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQty,
  replaceProducts,
  deleteCart,
  deleteProductFromCart,
};