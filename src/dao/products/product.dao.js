import { flatten } from "#dao/utils.js";
import ProductModel from "#models/product.model.js";

const get = async (filter, options) =>
  await ProductModel.paginate(filter, options);

const getBy = async (id) => await ProductModel.findById(id);

const getFilters = async (filterBase = {}) => {
  const [result] = await ProductModel.aggregate([
    { $match: filterBase },
    {
      $facet: {
        categories: [
          { $unwind: "$categories" },
          { $group: { _id: "$categories" } },
          { $sort: { _id: 1 } },
        ],
        brand: [{ $group: { _id: "$brand" } }, { $sort: { _id: 1 } }],
        colors: [
          { $unwind: "$colors" },
          { $group: { _id: "$colors" } },
          { $sort: { _id: 1 } },
        ],
        sizes: [
          { $unwind: "$sizes" },
          { $group: { _id: "$sizes" } },
          { $sort: { _id: 1 } },
        ],
        prices: [
          {
            $group: {
              _id: null,
              min: { $min: "$price" },
              max: { $max: "$price" },
            },
          },
        ],
      },
    },
  ]);

  return result;
};

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
  getFilters
};

export { productDAO };
