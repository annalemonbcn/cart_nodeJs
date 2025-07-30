import AddressModel from "#models/address.model.js";

const getAllAddressService = async () => {
  try {
    return await AddressModel.find();
  } catch (error) {
    throw new Error(`Error getting addresses: ` + error.message);
  }
};

const getAddressByIdService = async (addressId) => {
  try {
    const address = await AddressModel.findById(addressId);
    if (!address) return null;

    return address;
  } catch (error) {
    throw new Error(`Error getting address by id: ` + error.message);
  }
};

const createAddressService = async (address) => {
  try {
    const newAddress = await AddressModel.create(address);
    return newAddress;
  } catch (error) {
    throw new Error(`Error creating address: ` + error.message);
  }
};

const updateAddressService = async (addressId, fieldsToUpdate) => {
  try {
    const options = { new: true, runValidators: true };
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      fieldsToUpdate,
      options
    );
    if (!updatedAddress) return null;

    return updatedAddress;
  } catch (error) {
    throw new Error(`Error updating address ${addressId}: ` + error.message);
  }
};

const deleteAddressService = async (addressId) => {
  try {
    const deletedAddress = await AddressModel.findByIdAndDelete(addressId);
    if (!deletedAddress) return null;

    return deletedAddress;
  } catch (error) {
    throw new Error(`Error deleting address ${addressId}: ` + error.message);
  }
};

const addressServices = {
  getAllAddressService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
};

export { addressServices };
