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
import { validateAndFetchObject } from "#utils/validators.js";
import { canAccessCart } from "./utils.js";
import { collectionNames } from "../../db/constants/index.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.param("cid", async (req, res, next, cid) => {
  const cart = await validateAndFetchObject(
    cid,
    collectionNames.cartsCollection
  );

  if (!canAccessCart(req.user, cart.user)) return next(new ForbiddenError());

  req.cart = cart;
  next();
});

router.param("pid", async (req, res, next, pid) => {
  const product = await validateAndFetchObject(
    pid,
    collectionNames.productsCollection
  );

  req.product = product;
  next();
});

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);
router.put("/:cid/product/:pid", updateProductQty);
router.put("/:cid", replaceProducts);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
