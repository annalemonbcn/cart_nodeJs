import { Router } from "express";
import {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
} from "#controllers/address/address.controller.js";

const router = Router();

router.get("/", getAllAddress);
router.get("/:addressId", getAddressById);
router.post("/", createAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
