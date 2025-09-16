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
import { ForbiddenError } from "#utils/errors.js";
import { canAccessCart } from "./utils.js";
import { collectionNames } from "../../db/constants/index.js";
import { validateParam } from "#middlewares/validateParam/index.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.param(
  "cid",
  validateParam("cid", collectionNames.cartsCollection, "cart")
);

router.param(
  "pid",
  validateParam("pid", collectionNames.productsCollection, "product")
);

router.param("cid", async (req, res, next) => {
  if (!canAccessCart(req.user, req.cart.user)) {
    return next(new ForbiddenError());
  }
  next();
});

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);
router.put("/:cid/product/:pid", updateProductQty);
router.put("/:cid", replaceProducts);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
