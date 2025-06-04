import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import CartsManager from "../managers/carts.manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cartsFilePath = path.join(__dirname, "..", "data", "carts.json");

const cm = new CartsManager(cartsFilePath);

const createCart = async (req, res) => {
  try {
    await cm.addCart();
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Cart created successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", code: 400, message: error.message });
  }
};

const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cm.getCartById(cid);
    res.status(200).json({ status: "success", code: 200, data: cart });
  } catch (error) {
    res
      .status(404)
      .json({ status: "error", code: 404, message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const product = { id: pid };

  try {
    await cm.addProductToCart(cid, product);
    res.status(200).json({
      status: "success",
      code: 200,
      message: `Product ${pid} added successfully to cart #${cid}`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", code: 400, message: error.message });
  }
};

export { createCart, getCartById, addProductToCart };
