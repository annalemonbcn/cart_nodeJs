import { addressServices } from "#services/address.services.js";
import mongoose from "mongoose";
import UserModel from "#models/user.model.js";
import { BadRequestError, NotFoundError } from "#utils/errors.js";

const {
  getAllAddressService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} = addressServices;

const getAllAddress = async (req, res) => {
  const addresses = await getAllAddressService();

  return res.status(200).json({
    status: "success",
    code: 200,
    payload: addresses,
  });
};

const getAddressById = async (req, res) => {
  const { addressId } = req.params;
  if (!addressId)
    throw new BadRequestError("getAddressById: Missing address id");

  const address = await getAddressByIdService(addressId);
  if (!address) throw new NotFoundError("getAddressById: Address not found");

  return res
    .status(200)
    .json({ status: "success", code: 200, payload: address });
};

const createAddress = async (req, res) => {
  const address = req.body;

  if (!address || Object.keys(address).length === 0)
    throw new BadRequestError(
      "createAddress: Missing address fields in request body"
    );

  if (!mongoose.Types.ObjectId.isValid(address.user))
    throw new BadRequestError("createAddress: Invalid user ID format");

  const userExists = await UserModel.exists({ _id: address.user });
  if (!userExists) throw new NotFoundError("createAddress: User not found");

  const newAddress = await createAddressService(address);

  // TODO: keep this here?
  await UserModel.findByIdAndUpdate(address.user, {
    $push: { addresses: newAddress._id },
  });

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

  if (!addressId || Object.keys(fieldsToUpdate).length === 0)
    throw new BadRequestError(
      "updateAddress: Missing address id or fieldsToUpdate property in request"
    );

  if ("user" in req.body)
    throw new BadRequestError(
      "updateAddress: The user of an address cannot be modified"
    );

  const updatedAddress = await updateAddressService(addressId, fieldsToUpdate);

  if (!updatedAddress)
    throw new NotFoundError("updateAddress: Address not found");

  await UserModel.findByIdAndUpdate(updatedAddress.user, {
    $pull: { addresses: addressId },
  });

  await UserModel.findByIdAndUpdate(updatedAddress.user, {
    $push: { addresses: updatedAddress._id },
  });

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Address updated successfully",
    payload: updatedAddress,
  });
};

const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId)
    throw new BadRequestError("deleteAddress: Missing address id");

  const deletedAddress = await deleteAddressService(addressId);

  if (!deletedAddress)
    throw new NotFoundError("deleteAddress: Address not found");

  await UserModel.findByIdAndUpdate(deletedAddress.user, {
    $pull: { addresses: addressId },
  });

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Address deleted successfully",
    payload: deletedAddress,
  });
};

export {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
