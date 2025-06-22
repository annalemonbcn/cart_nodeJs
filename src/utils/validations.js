import UserModel from "../db/models/user.model.js";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const validateUniqueEmail = async (email) => {
  const existingUser = await UserModel.findOne({ email });
  return !existingUser;
};

const validateStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]{8,}$/;

  return passwordRegex.test(password);
};

export { validateEmail, validateUniqueEmail, validateStrongPassword };
