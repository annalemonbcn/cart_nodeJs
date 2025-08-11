import AddressModel from "#models/address.model.js";
import { NotFoundError, UnauthorizedError } from "#utils/errors.js";
import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import {
  validateAddress,
  validateUserHasLessThanFiveAddresses,
  validateAddressBelongsToUser,
} from "./utils.js";

const getAddressByIdService = async (addressId, userId) => {
  const address = await addressDAO.getAddressById(addressId);
  if (!address)
    throw new NotFoundError("getAddressByIdService: Address not found");

  validateAddressBelongsToUser(address, userId);

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

const updateAddressService = async (userId, addressId, fieldsToUpdate) => {
  const address = await addressDAO.getAddressById(addressId);
  if (!address) throw new NotFoundError("updateAddress: Address not found");

  validateAddressBelongsToUser(address, userId);

  const updatedAddress = await addressDAO.updateAddress(
    addressId,
    fieldsToUpdate
  );

  return updatedAddress;
};

const deleteAddressService = async (userId, addressId) => {
  const address = await addressDAO.getAddressById(addressId);
  if (!address) throw new NotFoundError("deleteAddress: Address not found");

  validateAddressBelongsToUser(address, userId);

  await userDAO.removeAddressFromUser(userId, addressId);

  return await addressDAO.deleteAddress(addressId);
};

const addressServices = {
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
};

export { addressServices };
