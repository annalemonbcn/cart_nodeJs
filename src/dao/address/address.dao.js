import AddressModel from "#models/address.model.js";

const createAddress = async (address) => await AddressModel.create(address);

const addressDAO = {
  createAddress,
};

export { addressDAO };
