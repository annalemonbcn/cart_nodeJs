import { addressServices } from "#services/address/address.services.js";
import { BadRequestError } from "#utils/errors.js";
import { isValidAddressId } from "#services/address/utils.js";

const {
  createAddressService,
  getAddressByIdService,
  updateAddressService,
  updateDefaultStatusService,
  deleteAddressService,
} = addressServices;

const createAddress = async (req, res) => {
  const userId = req.user.id;
  const addressData = req.body;

  if (!addressData || Object.keys(addressData).length === 0)
    throw new BadRequestError(
      "createAddress: Missing address fields in request body"
    );

  const newAddress = await createAddressService(userId, addressData);

  return res.status(201).json({
    status: "success",
    code: 201,
    message: "Address successfully created",
    payload: newAddress,
  });
};

const getAddressById = async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;

  if (!addressId)
    throw new BadRequestError("getAddressById: Missing address id");

  isValidAddressId(addressId);

  const address = await getAddressByIdService(addressId, userId);

  return res
    .status(200)
    .json({ status: "success", code: 200, payload: address });
};

const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const fieldsToUpdate = req.body;
  const userId = req.user.id;

  if (!addressId || Object.keys(fieldsToUpdate).length === 0)
    throw new BadRequestError(
      "updateAddress: Missing address id or fieldsToUpdate property in request"
    );

  isValidAddressId(addressId);

  if ("user" in req.body)
    throw new BadRequestError(
      "updateAddress: property 'user' cannot be modified"
    );

  const updatedAddress = await updateAddressService(
    userId,
    addressId,
    fieldsToUpdate
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Address updated successfully",
    payload: updatedAddress,
  });
};

const updateDefaultStatus = async (req, res) => {
  const { addressId } = req.params;
  const { isDefault } = req.body;
  const userId = req.user.id;

  if (!addressId)
    throw new BadRequestError("updateDefaultStatus: Missing address id");

  if (typeof isDefault !== "boolean")
    throw new BadRequestError("updateDefaultStatus: isDefault must be boolean");

  const updatedAddress = await updateDefaultStatusService(
    userId,
    addressId,
    isDefault
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Default address status updated successfully",
    payload: updatedAddress,
  });
};

const deleteAddress = async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;

  if (!addressId)
    throw new BadRequestError("deleteAddress: Missing address id");

  isValidAddressId(addressId);

  await deleteAddressService(userId, addressId);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Address deleted successfully",
  });
};

export {
  getAddressById,
  createAddress,
  updateAddress,
  updateDefaultStatus,
  deleteAddress,
};
