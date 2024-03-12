const genOrderTemplate = (order, name) => {
  const formatUnitAmount = (amount) => {
    const amountInPounds = amount / 100;
    return amountInPounds.toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP",
    });
  };
  return {
    name,
    order_number: order.orderNo,
    address_line_one: order.shippingAddress.line1,
    city: order.shippingAddress.city,
    postal_code: order.shippingAddress.postalCode,
    order_items: order.items.map((item) => ({
      name: item.name,
      price: formatUnitAmount(item.unitAmount),
      qty: item.quantity,
    })),
    total: order.formattedTotal,
  };
};

module.exports = genOrderTemplate;
