import { countries } from "countries-list";

const phoneRegex = /^\+\d{6,15}$/;
const zipCodeRegex = /^[A-Za-z0-9\- ]{3,10}$/;
const mongoObjectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

const validCountries = Object.values(countries).map((c) => c.name);

const requiredFields = [
  "firstName",
  "lastName",
  "phoneNumber",
  "deliveryAddress",
];
const requiredDeliveryFields = [
  "street",
  "zipCode",
  "city",
  "province",
  "country",
];

export {
  phoneRegex,
  zipCodeRegex,
  mongoObjectIdRegex,
  requiredFields,
  requiredDeliveryFields,
  validCountries,
};
