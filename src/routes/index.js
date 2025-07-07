import { Router } from "express";
import productsRoutes from "#routes/api/products.routes.js";
import cartsRoutes from "#routes/api/carts.routes.js";
import viewsRoutes from "#routes/views/views.routes.js";
import authRoutes from "#routes/auth/index.js";
import usersRoutes from "#routes/users/index.js";

const router = Router();

router.use("/api/products", productsRoutes);
router.use("/api/carts", cartsRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", usersRoutes);
router.use("/", viewsRoutes); // -> TODO: delete in a future

export default router;
