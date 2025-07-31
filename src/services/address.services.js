import AddressModel from "#models/address.model.js";
import { NotFoundError } from "#utils/errors.js";

const getAllAddressService = async () => {
  const addresses = await AddressModel.find();
  return addresses;
};

const getAddressByIdService = async (addressId) => {
  const address = await AddressModel.findById(addressId);
  if (!address) throw new NotFoundError("getAddressById: Address not found");

  return address;
};

const createAddressService = async (address) => {
  const newAddress = await AddressModel.create(address);
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
  if (!deletedAddress) throw new NotFoundError("deleteAddress: Address not found");

  return deletedAddress;
};

const addressServices = {
  getAllAddressService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
};

export { addressServices };
