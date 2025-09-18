import { BadRequestError } from "#utils/errors.js";

const validateUserHasLessThanFiveAddresses = (userAddresses) => {
  if (userAddresses.length >= 5) {
    throw new BadRequestError("User cannot have more than 5 addresses");
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

export { validateUserHasLessThanFiveAddresses, validateIsUniqueDefaultAddress };
