const genUpdateMessages = (cartItems, foundItems) => {
  const messages = {
    outOfStock: [],
    quantityUpdated: [],
    priceUpdated: [],
  };

  for (let item of cartItems) {
    const desiredQty = item.quantity;
    const availableQty = foundItems.find(
      (found) => found._id.toString() === item.id.toString()
    )?.numberInStock;

    if (!availableQty) {
      messages.outOfStock.push(item.id);
    } else {
      if (desiredQty > availableQty) {
        messages.quantityUpdated.push(item.id);
      }
    }
  }
  return messages;
};

module.exports = genUpdateMessages;
