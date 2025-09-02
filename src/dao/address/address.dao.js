import AddressModel from "#models/address.model.js";

const getAddressById = async (addressId, session) =>
  await AddressModel.findById(addressId).session(session);

const getDefaultAddressByUser = async (userId) =>
  await AddressModel.findOne({ user: userId, isDefault: true });

const createAddress = async (address) => await AddressModel.create(address);

const updateAddress = async (addressId, fieldsToUpdate) => {
  const setFields = {};

  for (const key in fieldsToUpdate) {
    if (
      typeof fieldsToUpdate[key] === "object" &&
      fieldsToUpdate[key] !== null &&
      !Array.isArray(fieldsToUpdate[key])
    ) {
      for (const subKey in fieldsToUpdate[key]) {
        setFields[`${key}.${subKey}`] = fieldsToUpdate[key][subKey];
      }
    } else {
      setFields[key] = fieldsToUpdate[key];
    }
  }

  return await AddressModel.findByIdAndUpdate(
    addressId,
    { $set: setFields },
    {
      new: true,
      runValidators: true,
    }
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

const deleteAddress = async (addressId, options = {}) =>
  await AddressModel.findByIdAndDelete(addressId, options);

const addressDAO = {
  getAddressById,
  getDefaultAddressByUser,
  createAddress,
  updateAddress,
  unsetDefaultForUser,
  setDefaultStatus,
  deleteAddress,
};

export { addressDAO };
