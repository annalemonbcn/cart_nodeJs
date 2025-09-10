const canAccessCart = (reqUser, cartUser) => {
  if (reqUser.role === "admin" || reqUser.id.toString() === cartUser.toString())
    return true;

  return false;
};

export { canAccessCart };
