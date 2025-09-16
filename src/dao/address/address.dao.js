import { flatten } from "#dao/utils.js";
import AddressModel from "#models/address.model.js";

const getAddressById = async (addressId, session) =>
  await AddressModel.findById(addressId).session(session);

const getDefaultAddressByUser = async (userId) =>
  await AddressModel.findOne({ user: userId, isDefault: true });

const createAddress = async (address) => await AddressModel.create(address);

const updateAddress = async (addressId, fieldsToUpdate) => {
  const setFields = flatten(fieldsToUpdate);

  return await AddressModel.findByIdAndUpdate(
    addressId,
    { $set: setFields },
    { new: true, runValidators: true }
  );
};

const unsetDefaultForUser = async (userId) =>
  await AddressModel.updateMany(
    { user: userId, isDefault: true },
    { $set: { isDefault: false } }
  );

const setDefaultStatus = async (addressId, isDefault) =>
  await AddressModel.findByIdAndUpdate(
    addressId,
    { $set: { isDefault } },
    { new: true }
  );

const softDelete = async (addressId, options = {}) =>
  await AddressModel.findByIdAndUpdate(
    addressId,
    { deletedAt: new Date() },
    options
  );

const hardDelete = async (addressId, options = {}) =>
  await AddressModel.findByIdAndDelete(addressId, options);

const addressDAO = {
  getAddressById,
  getDefaultAddressByUser,
  createAddress,
  updateAddress,
  unsetDefaultForUser,
  setDefaultStatus,
  softDelete,
  hardDelete,
};

export { addressDAO };
