import Joi from "joi";
import { regex } from "#utils/regex.js";

const { emailRegex, phoneRegex, passwordRegex } = regex;

const updateUserProfileSchemaValidation = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string()
    .pattern(emailRegex)
    .message("Invalid email format")
    .optional(),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .message("Invalid phoneNumber format")
    .optional(),
});

const updatePasswordSchemaValidation = Joi.object({
  password: Joi.string()
    .pattern(passwordRegex)
    .message("Invalid password format")
    .required(),
});

export { updateUserProfileSchemaValidation, updatePasswordSchemaValidation };
