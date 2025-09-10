import { BadRequestError } from "#utils/errors.js";
import {
  validateMongooseObject,
  validateObjectExistsInCollection,
} from "#utils/validators.js";
import { collectionNames } from "../../db/constants/index.js";

const validateQuantity = (quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0)
    throw new BadRequestError("Quantity must be a positive integer");

  return true;
};

const validateProducts = async (products) => {
  if (!Array.isArray(products) || products.length === 0)
    new BadRequestError("Missing products in request");

  await Promise.all(
    products.map(async (product) => {
      validateMongooseObject(product.product);
      await validateObjectExistsInCollection(
        product.product,
        collectionNames.productsCollection
      );
      validateQuantity(product.quantity);
    })
  );

  return true;
};

export { validateQuantity, validateProducts };
