import { addressServices } from "#services/address/address.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  createAddressService,
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

const getAddressById = async (req, res) =>
  res.status(200).json({
    status: "success",
    code: 200,
    message: "Address retrieved successfully",
    payload: req.address,
  });

const updateAddress = async (req, res) => {
  const addressId = req.address._id.toString();
  const userId = req.user.id;
  const fieldsToUpdate = req.body;

  if (Object.keys(fieldsToUpdate).length === 0)
    throw new BadRequestError(" Missing fieldsToUpdate property in request");

  if ("user" in req.body)
    throw new BadRequestError("property 'user' cannot be modified");

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
  const addressId = req.address._id.toString();
  const userId = req.user.id;
  const { isDefault } = req.body;

  if (typeof isDefault !== "boolean")
    throw new BadRequestError("isDefault must be boolean");

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
  const addressId = req.address._id.toString();
  const userId = req.user.id;

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
