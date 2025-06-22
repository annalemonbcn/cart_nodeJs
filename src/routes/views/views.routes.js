import { Router } from "express";
import { productServices } from "../../services/products.services.js";
import { cartServices } from "../../services/carts.services.js";
import { MOCK_CART_ID } from "../../helpers/index.js";

const router = Router();

router.get("/products", async (req, res) => {
  const { fetchProducts } = productServices;

  try {
    const { docs, pageContext } = await fetchProducts(req);
    const cartId = MOCK_CART_ID;

    res.json({ products: docs, cartId, pageContext });
  } catch (error) {
    console.error("Error while loading products:", error.message);
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const { getProductsByCartId } = cartServices;

  try {
    const cart = await getProductsByCartId(req);

    res.json({ cart });
  } catch (error) {
    console.error("Error while loading cart:", error.message);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error while loading cart",
    });
  }
});

export default router;