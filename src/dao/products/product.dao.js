import { flatten } from "#dao/utils.js";
import ProductModel from "#models/product.model.js";

const get = async (filter, options) =>
  await ProductModel.paginate(filter, options);

const getBy = async (id) => await ProductModel.findById(id);

const save = async (doc) => await ProductModel.create(doc);

const update = async (id, doc) => {
  const setFields = flatten(doc);

  return await ProductModel.findByIdAndUpdate(
    id,
    { $set: setFields },
    { new: true, runValidators: true }
  );
};

const deleteProduct = async (id) => await ProductModel.findByIdAndDelete(id);

const productDAO = {
  get,
  getBy,
  save,
  update,
  delete: deleteProduct,
};

export { productDAO };
