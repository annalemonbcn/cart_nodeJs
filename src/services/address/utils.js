import { BadRequestError, UnauthorizedError } from "#utils/errors.js";
import mongoose from "mongoose";

const validateUserHasLessThanFiveAddresses = (userAddresses) => {
  if (userAddresses.length >= 5) {
    throw new BadRequestError("User cannot have more than 5 addresses");
  }
};

const validateAddressBelongsToUser = (address, userId) => {
  if (address.user.toString() !== userId.toString()) {
    throw new UnauthorizedError("Address does not belong to user");
  }
};

const validateIsUniqueDefaultAddress = (
  isDefault,
  currentAddressId,
  userAddresses
) => {
  if (!isDefault) return;

  const existingDefault = userAddresses
    .filter((addr) => addr._id.toString() !== currentAddressId.toString())
    .find((addr) => addr.isDefault);

  if (existingDefault) {
    throw new BadRequestError("User can only have one default address");
  }
};

const isValidAddressId = (addressId) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new BadRequestError("Invalid address id");
  }

  return true;
};

export {
  validateUserHasLessThanFiveAddresses,
  validateAddressBelongsToUser,
  validateIsUniqueDefaultAddress,
  isValidAddressId,
};
