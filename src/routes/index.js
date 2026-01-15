import { Router } from "express";
import productsRoutes from "#routes/api/products.routes.js";
import cartsRoutes from "#routes/api/carts.routes.js";
import authRoutes from "#routes/api/auth.routes.js";
import usersRoutes from "#routes/api/user.routes.js";
import addressRoutes from "#routes/api/address.routes.js";
import favouritesRoutes from "#routes/api/favourites.routes.js";

const router = Router();

router.use("/api/products", productsRoutes);
router.use("/api/carts", cartsRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/user", usersRoutes);
router.use("/api/user/favourites", favouritesRoutes);
router.use("/api/address", addressRoutes);

export default router;
