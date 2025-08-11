import { Router } from "express";
import {
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "#controllers/address/address.controller.js";
import { authenticateJwt } from "#middlewares/auth/index.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", createAddress);
router.get("/:addressId", getAddressById);
router.put("/:addressId", updateAddress);
router.patch("/:addressId/default", setDefaultAddress);
router.delete("/:addressId", deleteAddress);

export default router;
