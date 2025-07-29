import { Router } from "express";
import productsRoutes from "#routes/api/products.routes.js";
import cartsRoutes from "#routes/api/carts.routes.js";
import viewsRoutes from "#routes/views/views.routes.js";
import authRoutes from "#routes/auth/index.js";
import usersRoutes from "#routes/user/index.js";
import addressRoutes from "#routes/api/address.routes.js";

const router = Router();

router.use("/api/products", productsRoutes);
router.use("/api/carts", cartsRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/user", usersRoutes);
router.use("/api/address", addressRoutes);
router.use("/", viewsRoutes); // -> TODO: delete in a future

export default router;
