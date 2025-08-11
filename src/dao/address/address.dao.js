import AddressModel from "#models/address.model.js";

const getAddressById = async (addressId) =>
  await AddressModel.findById(addressId);

const createAddress = async (address) => await AddressModel.create(address);

const updateAddress = async (addressId, fieldsToUpdate) =>
  await AddressModel.findByIdAndUpdate(addressId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

const unsetDefaultForUser = async (userId) =>
  await AddressModel.updateMany(
    { user: userId, isDefault: true },
    { $set: { isDefault: false } }
  );

const setDefaultAddress = async (addressId) =>
  await AddressModel.findByIdAndUpdate(
    addressId,
    { $set: { isDefault: true } },
    { new: true }
  );

const deleteAddress = async (addressId) =>
  await AddressModel.findByIdAndDelete(addressId);

const addressDAO = {
  getAddressById,
  createAddress,
  updateAddress,
  unsetDefaultForUser,
  setDefaultAddress,
  deleteAddress,
};

export { addressDAO };
