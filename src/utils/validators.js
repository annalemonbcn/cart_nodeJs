import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "./errors.js";
import { collectionNameToDAOMap } from "./collections.js";

const validateMongooseObject = (objId) => {
  if (!mongoose.Types.ObjectId.isValid(objId))
    throw new BadRequestError(`Invalid id or id format: ${objId}`);

  return true;
};

const validateObjectExistsInCollection = async (objId, collectionName) => {
  const daoMethod = collectionNameToDAOMap[collectionName];
  if (!daoMethod) {
    throw new Error(`No DAO method mapped for collection: ${collectionName}`);
  }

  const object = await daoMethod(objId);
  if (!object) {
    throw new NotFoundError(
      `Object with ID ${objId} in ${collectionName} not found`
    );
  }

  return object;
};

const validateAndFetchObject = async (objId, collectionName) => {
  validateMongooseObject(objId);

  const object = await validateObjectExistsInCollection(objId, collectionName);
  return object;
};

export {
  validateMongooseObject,
  validateObjectExistsInCollection,
  validateAndFetchObject,
};
