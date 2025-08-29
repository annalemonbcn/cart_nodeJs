import Joi from "joi";
import { regex } from "#utils/regex.js";

const { emailRegex, passwordRegex } = regex;

const authSchemaValidation = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .message("Invalid email format")
    .required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .message(
      "Password must be at least 8 characters, include one uppercase letter and one special character"
    )
    .required(),
});

const registerSchemaValidation = authSchemaValidation.keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

const loginSchemaValidation = authSchemaValidation;

export { registerSchemaValidation, loginSchemaValidation };
