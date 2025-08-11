import { Router } from "express";
import {
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  updateDefaultStatus,
} from "#controllers/address/address.controller.js";
import { authenticateJwt } from "#middlewares/auth/index.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", createAddress);
router.get("/:addressId", getAddressById);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

router.patch("/:addressId/default", updateDefaultStatus);

export default router;
