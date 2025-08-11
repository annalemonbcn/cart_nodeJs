import { addressServices } from "#services/address/address.services.js";
import UserModel from "#models/user.model.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "#utils/errors.js";

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

  const address = await getAddressByIdService(addressId);
  if (!address) throw new NotFoundError("getAddressById: Address not found");

  if (address.user.toString() !== userId)
    throw new UnauthorizedError("getAddressById: Unauthorized");

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

  if (updatedAddress.user.toString() !== userId)
    throw new UnauthorizedError("updateAddress: Unauthorized");

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

// TODO: implement soft delete
const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId)
    throw new BadRequestError("deleteAddress: Missing address id");

  const deletedAddress = await deleteAddressService(addressId);
  if (!deletedAddress)
    throw new NotFoundError("deleteAddress: Address not found");

  if (deletedAddress.user.toString() !== userId)
    throw new UnauthorizedError("deleteAddress: Unauthorized");

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

export { getAddressById, createAddress, updateAddress, deleteAddress };
