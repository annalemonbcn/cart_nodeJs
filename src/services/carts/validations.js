const validateStock = (requestedQuantity, availableStock) => {
  if (requestedQuantity > availableStock)
    throw new BadRequestError("Product is out of stock");

  return true;
};

export { validateStock };
