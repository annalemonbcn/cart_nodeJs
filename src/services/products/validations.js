import Joi from "joi";
import {
  validFabric,
  validPattern,
  validFit,
  validNeck,
  validSleeve,
  validStyle,
  validBrands,
  validSizes,
  validColours,
  validCategories,
} from "./constants.js";

const featuresSchemaValidation = Joi.object({
  fabric: Joi.string()
    .valid(...validFabric)
    .required(),
  pattern: Joi.string()
    .valid(...validPattern)
    .required(),
  fit: Joi.string()
    .valid(...validFit)
    .required(),
  neck: Joi.string()
    .valid(...validNeck)
    .required(),
  sleeve: Joi.string()
    .valid(...validSleeve)
    .required(),
  style: Joi.string()
    .valid(...validStyle)
    .required(),
});

const productSchemaValidation = Joi.object({
  code: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  brand: Joi.string()
    .valid(...validBrands)
    .required(),
  features: featuresSchemaValidation.required(),
  sizes: Joi.array()
    .items(Joi.string().valid(...validSizes))
    .required(),
  colours: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .valid(...validColours)
          .required(),
        available: Joi.boolean(),
      })
    )
    .length(validColours.length)
    .required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  categories: Joi.array()
    .items(Joi.string().valid(...validCategories))
    .required(),
  thumbnails: Joi.array().items(Joi.string().uri()).required(),
});

const updateFeaturesSchemaValidation = Joi.object({
  fabric: Joi.string()
    .valid(...validFabric)
    .optional(),
  pattern: Joi.string()
    .valid(...validPattern)
    .optional(),
  fit: Joi.string()
    .valid(...validFit)
    .optional(),
  neck: Joi.string()
    .valid(...validNeck)
    .optional(),
  sleeve: Joi.string()
    .valid(...validSleeve)
    .optional(),
  style: Joi.string()
    .valid(...validStyle)
    .optional(),
});

const updateProductSchemaValidation = Joi.object({
  code: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  brand: Joi.string()
    .valid(...validBrands)
    .optional(),
  features: updateFeaturesSchemaValidation,
  sizes: Joi.array()
    .items(Joi.string().valid(...validSizes))
    .optional(),
  colours: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().valid(...validColours),
        available: Joi.boolean(),
      })
    )
    .length(validColours.length)
    .optional(),
  price: Joi.number().optional(),
  stock: Joi.number().optional(),
  categories: Joi.array()
    .items(Joi.string().valid(...validCategories))
    .optional(),
  thumbnails: Joi.array().items(Joi.string().uri()).optional(),
});

export { productSchemaValidation, updateProductSchemaValidation };
