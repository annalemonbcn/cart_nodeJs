import CartModel from "../db/models/cart.model.js";
import { cartServices } from "../services/carts.services.js";

const createCart = async (req, res) => {
  const cart = req.body;

  try {
    const newCart = await CartModel.create(cart);
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Cart created successfully",
      payload: newCart,
    });
  } catch (error) {
    console.error("Error while createCart:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const getCartById = async (req, res) => {
  const { getProductsByCartId } = cartServices;

  try {
    const cart = await getProductsByCartId(req);

    if (!cart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    res.status(200).json({ status: "success", code: 200, payload: cart });
  } catch (error) {
    console.error("Error while getCartById:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);

    if (!cart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    const productInCart = cart.products.find(
      ({ product }) => product.toString() === pid
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: `Product ${pid} added successfully to cart ${cid}`,
      payload: cart,
    });
  } catch (error) {
    console.error("Error while addProductToCart:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const replaceProducts = async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  try {
    const cart = await CartModel.findById(cid);

    if (!cart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    cart.products = products;
    console.log("cart", cart);

    await cart.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: `Cart ${cid} updated successfully`,
      payload: cart,
    });
  } catch (error) {
    console.error("Error while replaceProducts:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const updateProductQty = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await CartModel.findById(cid);

    if (!cart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    const productInCart = cart.products.find(
      ({ product }) => product.toString() === pid
    );

    if (!productInCart)
      return res.status(400).json({
        status: "error",
        code: 400,
        message: `Cart with id ${cid} doesn't include product ${pid}`,
      });

    productInCart.quantity = quantity;

    await cart.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: `Quantity updated to ${quantity} for product ${pid} in cart ${cid}`,
      payload: cart,
    });
  } catch (error) {
    console.error("Error while updateProductQty:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const deleteCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const deleted = await CartModel.findByIdAndDelete(cid);

    if (!deleted)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    res.status(200).json({
      status: "success",
      code: 200,
      message: `Cart ${cid} has been successfully deleted`,
    });
  } catch (error) {
    console.error("Error while deleteCart:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);

    if (!cart)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Cart with id ${cid} doesn't exist`,
      });

    const productInCart = cart.products.find(
      ({ product }) => product.toString() === pid
    );

    if (!productInCart)
      return res.status(400).json({
        status: "error",
        code: 400,
        message: `Cart with id ${cid} doesn't include product ${pid}`,
      });

    cart.products = cart.products.filter(
      ({ product }) => product.toString() !== pid
    );

    await cart.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: `Product ${pid} successfully deleted from cart ${cid}`,
      payload: cart,
    });
  } catch (error) {
    console.error("Error while deleteProductFromCart:", error.message);
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
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
