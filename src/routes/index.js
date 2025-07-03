import { Router } from "express";
import productsRoutes from "../routes/api/products.routes.js";
import cartsRoutes from "../routes/api/carts.routes.js";
import viewsRoutes from "../routes/views/views.routes.js";
import authRoutes from "../routes/auth/index.js";

const router = Router();

router.use("/api/products", productsRoutes);
router.use("/api/carts", cartsRoutes);
router.use("/api/auth", authRoutes);
router.use("/", viewsRoutes);

export default router;