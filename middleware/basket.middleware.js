const adjustUpdateQuantity = require("../utils/adjustUpdateQuantity");
const getObjectIds = require("../utils/getObjectIds");
const Product = require("../models/Product.model");
const genUpdateMessages = require("../utils/genUpdateMessages");
const AppError = require("../utils/AppError");
const User = require("../models/User.model");

const syncCartByStock = async (req, res, next) => {
  const cart = req.body.cartItems;
  const productIds = getObjectIds(cart);
  const foundProducts = await Product.find({
    _id: { $in: productIds },
    numberInStock: { $gte: 1 },
  }).exec();
  const updateMessages = genUpdateMessages(cart, foundProducts);
  const revisedCart = cart.map((item) => {
    const availableQty =
      foundProducts.find((found) => found._id.toString() === item.id.toString())
        ?.numberInStock || 0;
    return {
      ...item,
      quantity: adjustUpdateQuantity(item.quantity, availableQty),
    };
  });
  req.updateMessages = updateMessages;
  req.revisedCart = revisedCart.filter((item) => item.quantity > 0);
  next();
};

const persistRevisedCart = async (req, res, next) => {
  const { revisedCart, userId } = req;
  if (!revisedCart) throw new AppError(500, "Something went wrong");
  const foundUser = await User.findById(userId);
  if (!foundUser) throw new AppError(404, "User does not exist");
  foundUser.cart = [
    ...revisedCart.map((item) => ({
      product: item.id,
      quantity: item.quantity,
    })),
  ];
  await foundUser.save();
  next();
};
module.exports = {
  syncCartByStock,
  persistRevisedCart,
};
