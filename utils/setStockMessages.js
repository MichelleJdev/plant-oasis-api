const setStockMessages = (updatedQuantity, desiredQuantity) => {
  const response = {};

  const outOfStock = updatedQuantity === 0;
  if (outOfStock) {
    response.outOfStock = true;
  }
  if (updatedQuantity !== desiredQuantity && !outOfStock) {
    response.quantityChange = true;
  }

  return response;
};

module.exports = setStockMessages;
