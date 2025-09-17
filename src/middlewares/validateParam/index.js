import { validateAndFetchObject } from "#utils/validators.js";

const validateParam =
  (paramName, collectionName, reqProperty) => async (req, res, next, value) => {
    try {
      const object = await validateAndFetchObject(value, collectionName);
      req[reqProperty] = object;
      next();
    } catch (err) {
      next(err);
    }
  };

export { validateParam };
