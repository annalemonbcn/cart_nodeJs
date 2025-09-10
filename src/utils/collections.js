import { cartDAO } from "#dao/cart/cart.dao.js";
import { productDAO } from "#dao/products/product.dao.js";

const collectionNameToDAOMap = {
  carts: cartDAO.getCartById,
  products: productDAO.getProductById,
};

export { collectionNameToDAOMap };
