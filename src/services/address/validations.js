import Joi from "joi";
import { regex } from "#utils/regex.js";
import { validCountries } from "./constants.js";

const { zipCodeRegex, phoneRegex } = regex;

const deliveryAddressSchemaValidation = Joi.object({
  street: Joi.string().required(),
  additionalInfo: Joi.string().optional().empty(""),
  zipCode: Joi.string()
    .pattern(zipCodeRegex)
    .message("Zip code must be 3-10 characters long")
    .required(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  country: Joi.string()
    .valid(...validCountries)
    .required()
    .messages({
      "any.only": "Invalid country",
    }),
});

const addressSchemaValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  deliveryAddress: deliveryAddressSchemaValidation.required(),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .message("Invalid phoneNumber format")
    .required(),
  isDefault: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string().max(20)).max(5).optional().messages({
    "array.max": "You can add up to 5 tags maximum",
    "string.max": "Each tag must be ≤ 20 characters",
  }),
});

const editDeliveryAddressSchemaValidation = Joi.object({
  street: Joi.string().optional(),
  additionalInfo: Joi.string().optional().empty(""),
  zipCode: Joi.string()
    .pattern(zipCodeRegex)
    .message("Zip code must be 3-10 characters long")
    .optional(),
  city: Joi.string().optional(),
  province: Joi.string().optional(),
  country: Joi.string()
    .valid(...validCountries)
    .optional()
    .messages({
      "any.only": "Invalid country",
    }),
});

const editAddressSchemaValidation = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  deliveryAddress: editDeliveryAddressSchemaValidation.optional(),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .message("Invalid phoneNumber format")
    .optional(),
  isDefault: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string().max(20)).max(5).optional().messages({
    "array.max": "You can add up to 5 tags maximum",
    "string.max": "Each tag must be ≤ 20 characters",
  }),
});

export { addressSchemaValidation, editAddressSchemaValidation };
