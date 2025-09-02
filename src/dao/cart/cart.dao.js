import CartModel from "#models/cart.model.js";

const getCartById = async (cartId) => await CartModel.findById(cartId);

const softDelete = async (cartId, options = {}) =>
  await CartModel.findByIdAndUpdate(cartId, { deletedAt: new Date() }, options);

const hardDelete = async (cartId, options = {}) =>
  await CartModel.findByIdAndDelete(cartId, options);

const cartDAO = {
  getCartById,
  softDelete,
  hardDelete,
};

export { cartDAO };
