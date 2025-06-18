import { Router } from "express";
import {
  addProductToCart,
  createCart,
  getCartById,
  updateProductQty,
  replaceProducts,
  deleteCart,
  deleteProductFromCart,
} from "../../controllers/carts.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);
router.put("/:cid/product/:pid", updateProductQty);
router.put("/:cid", replaceProducts);
router.delete("/:cid", deleteCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;