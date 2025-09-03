import { cartServices } from "#services/carts.services.js";
import { BadRequestError } from "#utils/errors.js";

const {
  createCartService,
  addProductToCartService,
  replaceProductsService,
  updateQuantityService,
  deleteProductFromCartService,
} = cartServices;

// TODO: make sure that this is called when a user is created
const createCart = async (req, res) => {
  const cart = {
    user: req.user.id,
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

const getCartById = async (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    code: 200,
    payload: req.cart,
  });

const addProductToCart = async (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    throw new BadRequestError("Missing product id in request params");
  }

  const updatedCart = await addProductToCartService(req.cart.id, pid);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Product ${pid} added successfully to cart ${req.cart.id}`,
    payload: updatedCart,
  });
};

const updateProductQty = async (req, res) => {
  const { pid } = req.params;
  const body = req.body || {};
  const { quantity } = body;

  if (!pid || !quantity)
    throw new BadRequestError("Missing product id or quantity in request");

  const updatedCart = await updateQuantityService(req.cart.id, pid, quantity);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Quantity updated to ${quantity} for product ${pid} in cart ${req.cart.id}`,
    payload: updatedCart,
  });
};

const replaceProducts = async (req, res) => {
  const body = req.body || {};
  const { products } = body;

  if (!products || Object.keys(products).length === 0) {
    throw new BadRequestError("Missing products in request");
  }

  for (const item of products) {
    if (!item.product || typeof item.quantity !== "number") {
      throw new BadRequestError(
        "Each product must have a product id and a numeric quantity"
      );
    }
  }

  const updatedCart = await replaceProductsService(req.cart.id, products);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Cart ${req.cart.id} updated successfully`,
    payload: updatedCart,
  });
};

const deleteProductFromCart = async (req, res) => {
  const { pid } = req.params;
  if (!pid)
    throw new BadRequestError(
      "deleteProductFromCart: Missing product id in request params"
    );

  const cart = await deleteProductFromCartService(req.cart.id, pid);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: `Product ${pid} successfully deleted from cart ${req.cart.id}`,
    payload: cart,
  });
};

export {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQty,
  replaceProducts,
  deleteProductFromCart,
};
