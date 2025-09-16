import Joi from "joi";
import { regex } from "#utils/regex.js";
import { validCountries } from "./constants.js";

const { zipCodeRegex, phoneRegex } = regex;

const baseDeliveryAddressSchema = {
  street: Joi.string(),
  additionalInfo: Joi.string().allow("").optional(),
  zipCode: Joi.string()
    .pattern(zipCodeRegex)
    .message("Zip code must be 3-10 characters long"),
  city: Joi.string(),
  province: Joi.string(),
  country: Joi.string()
    .valid(...validCountries)
    .messages({
      "any.only": "Invalid country",
    }),
};

const deliveryAddressSchemaValidation = Joi.object({
  ...baseDeliveryAddressSchema,
  street: baseDeliveryAddressSchema.street.required(),
  zipCode: baseDeliveryAddressSchema.zipCode.required(),
  city: baseDeliveryAddressSchema.city.required(),
  province: baseDeliveryAddressSchema.province.required(),
  country: baseDeliveryAddressSchema.country.required(),
});

const editDeliveryAddressSchemaValidation = Joi.object(
  baseDeliveryAddressSchema
);

const baseAddressSchema = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  deliveryAddress: Joi.object(baseDeliveryAddressSchema),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .message("Invalid phoneNumber format"),
  isDefault: Joi.boolean(),
  tags: Joi.array().items(Joi.string().max(20)).max(5).messages({
    "array.max": "You can add up to 5 tags maximum",
    "string.max": "Each tag must be ≤ 20 characters",
  }),
};

const addressSchemaValidation = Joi.object({
  ...baseAddressSchema,
  firstName: baseAddressSchema.firstName.required(),
  lastName: baseAddressSchema.lastName.required(),
  deliveryAddress: deliveryAddressSchemaValidation.required(),
  phoneNumber: baseAddressSchema.phoneNumber.required(),
});

const editAddressSchemaValidation = Joi.object(baseAddressSchema);

export { addressSchemaValidation, editAddressSchemaValidation };
