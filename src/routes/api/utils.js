const canAccessCollection = (reqUser, collectionUser) => {
  if (
    reqUser.role === "admin" ||
    reqUser.id.toString() === collectionUser.toString()
  )
    return true;

  return false;
};

export { canAccessCollection };
