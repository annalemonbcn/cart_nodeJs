import { Router } from "express";
import {
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  updateDefaultStatus,
} from "#controllers/address/address.controller.js";
import { authenticateAndAuthorize } from "#middlewares/auth/index.js";
import { validateParam } from "#middlewares/validateParam/index.js";
import { collectionNames } from "../../db/constants/index.js";
import { canAccessCollection } from "./utils.js";
import { ForbiddenError } from "#utils/errors.js";

const router = Router();

router.use(authenticateAndAuthorize());

router.param(
  "addressId",
  validateParam("addressId", collectionNames.addressesCollection, "address")
);

router.param("addressId", async (req, res, next) => {
  if (!canAccessCollection(req.user, req.address.user)) {
    return next(new ForbiddenError());
  }

  next();
});

router.post("/", createAddress);
router.get("/:addressId", getAddressById);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/default", updateDefaultStatus);

export default router;
