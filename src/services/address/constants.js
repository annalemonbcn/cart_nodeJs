const phoneRegex = /^\+?\d{7,15}$/;

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

export { phoneRegex, requiredFields, requiredDeliveryFields };
