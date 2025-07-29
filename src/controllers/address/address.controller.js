import { addressServices } from "#services/address.services.js";
import mongoose from "mongoose";
import UserModel from "#models/user.model.js";

const {
  getAllAddressService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} = addressServices;

const getAllAddress = async (req, res) => {
  try {
    const addresses = await getAllAddressService();

    return res.status(200).json({
      status: "success",
      code: 200,
      payload: addresses,
    });
  } catch (error) {
    console.error("Error in getAllAddress:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const getAddressById = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing address id in request params",
    });

  try {
    const address = await getAddressByIdService(addressId);

    if (!address)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Address with id ${addressId} doesn't exist`,
      });

    return res
      .status(200)
      .json({ status: "success", code: 200, payload: address });
  } catch (error) {
    console.error("Error in getAddressById:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const createAddress = async (req, res) => {
  const address = req.body;

  if (!address || Object.keys(address).length === 0)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing address in request body",
    });

  if (!mongoose.Types.ObjectId.isValid(address.user)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid user ID format",
    });
  }

  try {
    const userExists = await UserModel.exists({ _id: address.user });
    if (!userExists) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    const newAddress = await createAddressService(address);

    await UserModel.findByIdAndUpdate(address.user, {
      $push: { addresses: newAddress._id },
    });

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Address successfully created",
      payload: newAddress,
    });
  } catch (error) {
    console.error("Error in createAddress:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const fieldsToUpdate = req.body;

  if (!addressId || Object.keys(fieldsToUpdate).length === 0)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing address id or fieldsToUpdate property in request",
    });

  if ("user" in req.body) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "The user of an address cannot be modified",
    });
  }

  try {
    const updatedAddress = await updateAddressService(
      addressId,
      fieldsToUpdate
    );

    if (!updatedAddress)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Address with id ${addressId} doesn't exist`,
      });

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
  } catch (error) {
    console.error("Error in updateAddress:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId)
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing address id in request params",
    });

  try {
    const deletedAddress = await deleteAddressService(addressId);

    if (!deletedAddress)
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Address with id ${addressId} doesn't exist`,
      });

    await UserModel.findByIdAndUpdate(deletedAddress.user, {
      $pull: { addresses: addressId },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Address deleted successfully",
      payload: deletedAddress,
    });
  } catch (error) {
    console.error("Error in deleteAddress:", error.message);
    return res
      .status(500)
      .json({ status: "error", code: 500, message: "Internal server error" });
  }
};

export {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
