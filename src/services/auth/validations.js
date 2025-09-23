import Joi from "joi";
import { regex } from "#utils/regex.js";

const { emailRegex, passwordRegex } = regex;

const emailSchemaValidation = Joi.object({
  email: Joi.string().pattern(emailRegex).message("Invalid email format"),
});

const passwordSchemaValidation = Joi.object({
  password: Joi.string()
    .pattern(passwordRegex)
    .message("Invalid password format"),
});

export { emailSchemaValidation, passwordSchemaValidation };
