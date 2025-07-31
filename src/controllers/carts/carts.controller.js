import { cartServices } from "#services/carts.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  createCartService,
  getCartService,
  addProductToCartService,
  replaceProductsService,
  updateQuantityService,
  deleteCartService,
  deleteProductFromCartService,
} = cartServices;

const createCart = async (req, res) => {
  const cart = {
    products: [],
  };

  const newCart = await createCartService(cart);

  return res.status(201).json({
    status: "success",
    code: 201,
    message: "Cart created successfully",
    payload: newCart,
  });
};

const getCartById = async (req, res) => {
  const { cid } = req.params;
  if (!cid)
    throw new BadRequestError("getCartById: Missing cart id in request params");

  const cart = await getCartService(cid, { populate: true, lean: true });

  return res.status(200).json({ status: "success", code: 200, payload: cart });
};

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!cid || !pid) {
    throw new BadRequestError(
      "addProductToCart: Missing cart id or product id in request params"
    );
  }

  const updatedCart = await addProductToCartService(cid, pid);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Product ${pid} added successfully to cart ${cid}`,
    payload: updatedCart,
  });
};

const replaceProducts = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!cid || Object.keys(products).length === 0) {
    throw new BadRequestError(
      "replaceProducts: Missing cart id or products in request body"
    );
  }

  const updatedCart = await replaceProductsService(cid, products);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Cart ${cid} updated successfully`,
    payload: updatedCart,
  });
};

const updateProductQty = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!cid || !pid || !quantity)
    throw new BadRequestError(
      "updateProductQty: Missing cart id, or product id, or quantity in request"
    );

  const updatedCart = await updateQuantityService(cid, pid, quantity);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Quantity updated to ${quantity} for product ${pid} in cart ${cid}`,
    payload: updatedCart,
  });
};

const deleteCart = async (req, res) => {
  const { cid } = req.params;

  if (!cid)
    throw new BadRequestError("deleteCart: Missing cart id in request params");

  await deleteCartService(cid);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Cart ${cid} has been successfully deleted`,
  });
};

const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!cid || !pid)
    throw new BadRequestError(
      "deleteProductFromCart: Missing cart id or product id in request params"
    );

  const cart = await deleteProductFromCartService(cid, pid);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Product ${pid} successfully deleted from cart ${cid}`,
    payload: cart,
  });
};

export {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQty,
  replaceProducts,
  deleteCart,
  deleteProductFromCart,
};
