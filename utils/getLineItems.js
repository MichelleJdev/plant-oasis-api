const getLineitems = (foundProducts, cartItems) => {
  const adjustQty = (numInStock, productId) => {
    const getCurrentQty = (productId) =>
      cartItems.find((item) => item.id === productId.toString()).quantity;
    const currentQty = getCurrentQty(productId);
    const adjustedQty = currentQty <= numInStock ? currentQty : numInStock;
    return adjustedQty;
  };

  const line_items = foundProducts.map((product) => ({
    price_data: {
      currency: "gbp",
      product_data: {
        name: product.name,
        metadata: {
          productId: product._id.toString(),
        },
      },
      unit_amount: product.unitAmount,
    },
    quantity: adjustQty(product.numberInStock, product._id),
  }));

  return line_items;
};

module.exports = getLineitems;
