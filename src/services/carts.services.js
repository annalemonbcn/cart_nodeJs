import CartModel from "../models/cart.model.js";

const getProductsByCartId = async (req) => {
  const { cid } = req.params;

  const cart = await CartModel.findById(cid).populate("products.product").lean();
  return cart;
};

const cartServices = {
  getProductsByCartId,
};

export { cartServices };
