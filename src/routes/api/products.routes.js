import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "#controllers/products/products.controller.js";
import { collectionNames } from "../../db/constants/index.js";
import { validateParam } from "#middlewares/validateParam/index.js";
import { authenticateAndAuthorize } from "#middlewares/auth/index.js";

const router = Router();

router.param(
  "pid",
  validateParam("pid", collectionNames.productsCollection, "product")
);

router.get("/", getAllProducts);
router.get("/:pid", getProductById);
router.post("/", authenticateAndAuthorize("admin"), createProduct);
router.put("/:pid", authenticateAndAuthorize("admin"), updateProduct);
router.delete("/:pid", authenticateAndAuthorize("admin"), deleteProduct);

export default router;
