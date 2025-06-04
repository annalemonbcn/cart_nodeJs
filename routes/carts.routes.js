import { Router } from "express";
import {
  addProductToCart,
  createCart,
  getCartById,
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);

export default router;
