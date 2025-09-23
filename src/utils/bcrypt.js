import "dotenv-flow/config";
import bcrypt from "bcrypt";

const bcryptSalt = process.env.BCRYPT_SALT;

const encryptPassword = (password) =>
  bcrypt.hashSync(password, Number(bcryptSalt));

export { encryptPassword };
