const validateUserIdInReq = (req) => {
  const userId = req.user?._id;
  if (!userId) throw new BadRequestError("Missing user id");

  return userId;
};

export { validateUserIdInReq };
