import { addressServices } from "#services/address/address.services.js";
import UserModel from "#models/user.model.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "#utils/errors.js";
import { isValidAddressId } from "#services/address/utils.js";

const {
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} = addressServices;

const getAddressById = async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  if (!addressId)
    throw new BadRequestError("getAddressById: Missing address id");

  isValidAddressId(addressId);

  const address = await getAddressByIdService(addressId, userId);

  return res
    .status(200)
    .json({ status: "success", code: 200, payload: address });
};

const createAddress = async (req, res) => {
  const userId = req.user._id;
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

const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const fieldsToUpdate = req.body;
  const userId = req.user._id;

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

const deleteAddress = async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  if (!addressId)
    throw new BadRequestError("deleteAddress: Missing address id");

  isValidAddressId(addressId);

  const deletedAddress = await deleteAddressService(userId, addressId);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Address deleted successfully",
    payload: deletedAddress,
  });
};

export { getAddressById, createAddress, updateAddress, deleteAddress };
