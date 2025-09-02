import CartModel from "#models/cart.model.js";

const getCartById = async (cartId) => await CartModel.findById(cartId);

const deleteCart = async (cartId, options = {}) =>
  await CartModel.findByIdAndDelete(cartId, options);

const cartDAO = {
  getCartById,
  deleteCart,
};

export { cartDAO };
