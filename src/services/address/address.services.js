import AddressModel from "#models/address.model.js";
import { NotFoundError } from "#utils/errors.js";
import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import {
  validateAddress,
  validateUserHasLessThanFiveAddresses,
} from "./utils.js";

const getAddressByIdService = async (addressId) => {
  const address = await AddressModel.findById(addressId);
  if (!address) throw new NotFoundError("getAddressById: Address not found");

  return address;
};

const createAddressService = async (userId, addressData) => {
  validateAddress(addressData);

  const user = await userDAO.getUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  validateUserHasLessThanFiveAddresses(user);

  addressData.user = userId;

  const newAddress = await addressDAO.createAddress(addressData);

  await userDAO.addAddressToUser(userId, newAddress._id);

  return newAddress;
};

const updateAddressService = async (addressId, fieldsToUpdate) => {
  const options = { new: true, runValidators: true };
  const updatedAddress = await AddressModel.findByIdAndUpdate(
    addressId,
    fieldsToUpdate,
    options
  );
  if (!updatedAddress)
    throw new NotFoundError("updateAddress: Address not found");

  return updatedAddress;
};

const deleteAddressService = async (addressId) => {
  const deletedAddress = await AddressModel.findByIdAndDelete(addressId);
  if (!deletedAddress)
    throw new NotFoundError("deleteAddress: Address not found");

  return deletedAddress;
};

const addressServices = {
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
};

export { addressServices };
