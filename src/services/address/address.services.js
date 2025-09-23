import { BadRequestError, NotFoundError } from "#utils/errors.js";
import { addressDAO } from "#dao/address/address.dao.js";
import { userDAO } from "#dao/user/user.dao.js";
import {
  validateUserHasLessThanFiveAddresses,
  validateIsUniqueDefaultAddress,
} from "./utils.js";
import {
  addressSchemaValidation,
  editAddressSchemaValidation,
} from "./validations.js";
import { withTransaction } from "#utils/transactions.js";

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

  const user = await userDAO.getActiveUserById(userId);

  validateIsUniqueDefaultAddress(
    fieldsToUpdate.isDefault,
    user.addresses,
    addressId
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

  if (isDefault) {
    await addressDAO.unsetDefaultForUser(userId);
  }

  return await addressDAO.setDefaultStatus(addressId, isDefault);
};

const deleteAddressService = async (userId, addressId) =>
  withTransaction(async (session) => {
    await userDAO.removeAddressFromUser(userId, addressId, session);

    await addressDAO.softDelete(addressId, session);
  });

const addressServices = {
  createAddressService,
  updateAddressService,
  updateDefaultStatusService,
  deleteAddressService,
};

export { addressServices };
