import {
  requiredDeliveryFields,
  requiredFields,
  phoneRegex,
} from "./constants.js";
import { BadRequestError } from "#utils/errors.js";

const validateAddressFields = (addressData) => {
  for (const field of requiredFields) {
    if (!addressData[field]) {
      throw new BadRequestError(`Missing required field '${field}'`);
    }
  }
};

const validateDeliveryAddressFields = (deliveryAddress) => {
  if (typeof deliveryAddress !== "object") {
    throw new BadRequestError("'deliveryAddress' must be an object");
  }
  for (const field of requiredDeliveryFields) {
    if (!deliveryAddress[field]) {
      throw new BadRequestError(
        `Missing required deliveryAddress field '${field}'`
      );
    }
  }
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneRegex.test(phoneNumber)) {
    throw new BadRequestError("Invalid phoneNumber format");
  }
};

const validateTags = (tags) => {
  if (tags && !Array.isArray(tags)) {
    throw new BadRequestError("'tags' must be an array of strings");
  }
};

const validateUserHasLessThanFiveAddresses = (user) => {
  if (user.addresses.length >= 5) {
    throw new BadRequestError("User cannot have more than 5 addresses");
  }
};

const validateAddress = (addressData) => {
  validateAddressFields(addressData);
  validateDeliveryAddressFields(addressData.deliveryAddress);
  validatePhoneNumber(addressData.phoneNumber);
  validateTags(addressData.tags);
};

export { validateAddress, validateUserHasLessThanFiveAddresses };
