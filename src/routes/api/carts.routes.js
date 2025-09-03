import { Router } from "express";
import {
  addProductToCart,
  createCart,
  getCartById,
  updateProductQty,
  replaceProducts,
  deleteProductFromCart,
} from "#controllers/carts/carts.controller.js";
import { authenticateAndAuthorize } from "#middlewares/auth/index.js";
import { cartDAO } from "#dao/cart/cart.dao.js";
import { ForbiddenError, NotFoundError } from "#utils/errors.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.param("cid", async (req, res, next, cid) => {
  const cart = await cartDAO.getCartById(cid);
  if (!cart) return next(new NotFoundError("Cart not found"));

  if (
    req.user.role !== "admin" &&
    cart.user.toString() !== req.user.id.toString()
  ) {
    return next(new ForbiddenError());
  }

  req.cart = cart.toJSON();
  next();
});

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);
router.put("/:cid/product/:pid", updateProductQty);
router.put("/:cid", replaceProducts);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
