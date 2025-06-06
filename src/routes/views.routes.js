import { Router } from "express";
import { productServices } from "../services/products.services.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/products", async (req, res) => {
  const { fetchProducts } = productServices;

  try {
    const { docs, pageContext } = await fetchProducts(req);

    res.render("products", { products: docs, pageContext });
  } catch (error) {
    console.error("Error while loading products:", error.message);
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
});

export default router;
