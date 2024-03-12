const Product = require("../models/Product.model");
const mongoose = require("mongoose");
const stripe = require("../config/stripe.config");
const getObjectIds = require("../utils/getObjectIds");
const getLineitems = require("../utils/getLineItems");
const genUpdateMessages = require("../utils/genUpdateMessages");
const User = require("../models/User.model");
const AppError = require("../utils/AppError");

const checkoutCart = async (req, res) => {
  const cartItems = req.body.cartItems;
  const productIds = getObjectIds(cartItems);

  const foundProducts = await Product.find({
    _id: { $in: productIds },
    numberInStock: { $gte: 1 },
  })
    .lean()
    .exec();

  const line_items = getLineitems(foundProducts, cartItems);
  if (!line_items.length)
    return res.status(404).json({ message: "no available products" });
  const updateMessages = genUpdateMessages(cartItems, foundProducts);
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/checkout-cancelled`,
    shipping_address_collection: {
      allowed_countries: ["GB"],
    },
  });
  res.status(200).json({ paymentUrl: session.url });
};

const checkoutAuthenticated = async (req, res) => {
  const foundUser = await User.findById(req.userId);
  if (!foundUser) throw new AppError(404, "user not found");
  const cartItems = req.body.cartItems;
  const productIds = cartItems.map((item) => mongoose.Types.ObjectId(item.id));
  const foundProducts = await Product.find({
    _id: { $in: productIds },
    numberInStock: { $gte: 1 },
  })
    .lean()
    .exec();
  const line_items = getLineitems(foundProducts, cartItems);
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/checkout-cancelled`,
    customer_email: foundUser.email,
    client_reference_id: foundUser._id.toString(),
    shipping_address_collection: {
      allowed_countries: ["GB"],
    },
  });

  res.status(200).json({ paymentUrl: session.url });
};

module.exports = {
  checkoutCart,
  checkoutAuthenticated,
};
