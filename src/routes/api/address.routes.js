import { Router } from "express";
import {
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "#controllers/address/address.controller.js";
import { authenticateJwt } from "#middlewares/auth/index.js";

const router = Router();

router.use(authenticateJwt);

router.get("/:addressId", getAddressById);
router.post("/", createAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
