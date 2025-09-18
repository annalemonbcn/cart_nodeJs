import { addressDAO } from "#dao/address/address.dao.js";
import { cartDAO } from "#dao/cart/cart.dao.js";
import { productDAO } from "#dao/products/product.dao.js";

const collectionNameToDAOMap = {
  carts: cartDAO.getCartById,
  products: productDAO.getBy,
  addresses: addressDAO.getAddressById,
};

export { collectionNameToDAOMap };
