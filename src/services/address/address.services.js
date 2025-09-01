import { BadRequestError, NotFoundError } from "#utils/errors.js";
import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import {
  validateUserHasLessThanFiveAddresses,
  validateAddressBelongsToUser,
  validateIsUniqueDefaultAddress,
} from "./utils.js";
import {
  addressSchemaValidation,
  editAddressSchemaValidation,
} from "./validations.js";
import { withTransaction } from "#services/utils.js";

const getAddressByIdService = async (addressId, userId) => {
  const address = await addressDAO.getAddressById(addressId);
  if (!address)
    throw new NotFoundError("getAddressByIdService: Address not found");

  validateAddressBelongsToUser(address, userId);

  return address;
};

const createAddressService = async (userId, addressData) => {
  const { error } = addressSchemaValidation.validate(addressData);
  if (error) throw new BadRequestError(error.details[0].message);

  const user = await userDAO.getActiveUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  validateUserHasLessThanFiveAddresses(user.addresses);
  validateIsUniqueDefaultAddress(addressData.isDefault, user.addresses);

  addressData.user = userId;

  const newAddress = await addressDAO.createAddress(addressData);

  await userDAO.addAddressToUser(userId, newAddress._id);

  return newAddress;
};

const updateAddressService = async (userId, addressId, fieldsToUpdate) => {
  const { error } = editAddressSchemaValidation.validate(fieldsToUpdate);
  if (error) throw new BadRequestError(error.details[0].message);

  const address = await addressDAO.getAddressById(addressId);
  if (!address) throw new NotFoundError("updateAddress: Address not found");

  validateAddressBelongsToUser(address, userId);

  const user = await userDAO.getActiveUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  validateIsUniqueDefaultAddress(
    fieldsToUpdate.isDefault,
    addressId,
    user.addresses
  );

  const updatedAddress = await addressDAO.updateAddress(
    addressId,
    fieldsToUpdate
  );

  return updatedAddress;
};

const updateDefaultStatusService = async (userId, addressId, isDefault) => {
  const address = await addressDAO.getAddressById(addressId);
  if (!address) throw new NotFoundError("Address not found");
  validateAddressBelongsToUser(address, userId);

  if (isDefault) {
    await addressDAO.unsetDefaultForUser(userId);
  }

  return await addressDAO.setDefaultStatus(addressId, isDefault);
};

const deleteAddressService = async (userId, addressId) =>
  withTransaction(async (session) => {
    const address = await addressDAO.getAddressById(addressId, session);
    if (!address) throw new NotFoundError("deleteAddress: Address not found");

    validateAddressBelongsToUser(address, userId);

    await userDAO.removeAddressFromUser(userId, addressId, session);

    await addressDAO.deleteAddress(addressId, session);
  });

const addressServices = {
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  updateDefaultStatusService,
  deleteAddressService,
};

export { addressServices };
