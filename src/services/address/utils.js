import { BadRequestError } from "#utils/errors.js";

const validateUserHasLessThanFiveAddresses = (userAddresses) => {
  if (userAddresses.length >= 5) {
    throw new BadRequestError("User cannot have more than 5 addresses");
  }
};

const validateIsUniqueDefaultAddress = (
  isDefault,
  userAddresses,
  currentAddressId = null
) => {
  if (!isDefault) return;

  const existingDefault = userAddresses.find((addr) => {
    if (currentAddressId) {
      return (
        addr._id.toString() !== currentAddressId.toString() && addr.isDefault
      );
    }
    return addr.isDefault;
  });
  if (existingDefault) {
    throw new BadRequestError("User can only have one default address");
  }
};

export { validateUserHasLessThanFiveAddresses, validateIsUniqueDefaultAddress };
