const phoneRegex = /^\+\d{6,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]{8,}$/;
const zipCodeRegex = /^[A-Za-z0-9\- ]{3,10}$/;
const mongoObjectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

const regex = {
  phoneRegex,
  emailRegex,
  passwordRegex,
  zipCodeRegex,
  mongoObjectIdRegex,
};

export { regex };
