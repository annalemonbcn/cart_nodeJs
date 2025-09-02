import { Router } from "express";
import {
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  updateDefaultStatus,
} from "#controllers/address/address.controller.js";
import { authenticateAndAuthorize } from "#middlewares/auth/index.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.post("/", createAddress);
router.get("/:addressId", getAddressById);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/default", updateDefaultStatus);

export default router;
