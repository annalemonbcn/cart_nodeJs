import Joi from "joi";
import { regex } from "#utils/regex.js";

const { emailRegex } = regex;

const emailSchemaValidation = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .message("Invalid email format")
    .optional(),
});

export { emailSchemaValidation };
