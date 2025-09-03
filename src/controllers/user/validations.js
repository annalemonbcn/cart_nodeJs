import { BadRequestError } from "#utils/errors.js";

const validateUserIdInReq = (req) => {
  const userId = req.user?.id;
  if (!userId) throw new BadRequestError("Missing user id");

  return userId;
};

export { validateUserIdInReq };
