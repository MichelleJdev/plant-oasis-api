const { sgMail, message } = require("../config/mail.config");
const Order = require("../models/Order.model");
const uuid = require("uuid");
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = require("../config/stripe.config");
const ORDER_TEMPLATE_ID = process.env.ORDER_TEMPLATE_ID;
const genOrderTemplate = require("../utils/genOrderTemplate");

const handleCheckoutSuccess = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    STRIPE_WEBHOOK_SECRET
  );
  const session_id = event.data.object.id;

  const { customer_details, client_reference_id } = event.data.object;
  const address = customer_details.address;

  const line_items = await stripe.checkout.sessions.listLineItems(session_id, {
    expand: ["data.price.product"],
  });

  let orderNo = uuid.v4();
  orderNo = orderNo.substring(0, 13);
  const shippingAddress = {
    country: address.country,
    city: address.city,
    line1: address.line1,
    line2: address.line2,
    postalCode: address.postal_code,
  };
  const items = line_items.data.map((item) => ({
    product: item.price.product.metadata.productId,
    quantity: item.quantity,
    unitAmount: item.price.unit_amount,
    name: item.price.product.name,
  }));
  const orderData = {
    orderNo,
    customer: {
      user: client_reference_id,
      email: customer_details.email.toLowerCase(),
    },
    items,
    shippingAddress,
    status: "pending",
    total: event.data.object.amount_total,
  };
  const newOrder = new Order(orderData);
  await newOrder.save();

  const mail = await sgMail.send({
    to: "elvenivyvii@gmail.com",
    from: "elvenivyvii@gmail.com",
    templateId: ORDER_TEMPLATE_ID,
    dynamic_template_data: genOrderTemplate(newOrder, customer_details.name),
    subject: "Order details",
  });

  res.json({ received: true });
};

module.exports = {
  handleCheckoutSuccess,
};
