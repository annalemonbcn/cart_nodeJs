import mongoose from "mongoose";
import { collectionNames } from "../constants/index.js";

const deliveryAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  additionalInfo: String,
  zipCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.usersCollection,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const AddressModel = mongoose.model(
  collectionNames.addressesCollection,
  addressSchema
);

export default AddressModel;
