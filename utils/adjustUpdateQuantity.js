const adjustItemQuantity = (desiredQty, availableQty = 0) => {
  const adjustedQuantity =
    desiredQty <= availableQty ? desiredQty : availableQty;

  return adjustedQuantity;
};

module.exports = adjustItemQuantity;
