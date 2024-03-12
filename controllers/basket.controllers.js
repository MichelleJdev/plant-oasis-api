const adjustUpdateQuantity = require("../utils/adjustUpdateQuantity");
const getObjectIds = require("../utils/getObjectIds");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const setStockMessages = require("../utils/setStockMessages");
const AppError = require("../utils/AppError");

const handleGuestCartUpdate = async (req, res) => {
  const incomingUpdate = req.body.item;
  const desiredQuantity = incomingUpdate.quantity;
  const foundItem = await Product.findById(incomingUpdate.id);

  const updatedQuantity = adjustUpdateQuantity(
    desiredQuantity,
    foundItem?.numberInStock
  );

  const response = setStockMessages(updatedQuantity, desiredQuantity);

  response.updatedItem = {
    ...incomingUpdate,
    quantity: updatedQuantity,
  };
  res.json(response);
};
const handleAuthCartUpdate = async (req, res) => {
  const incomingUpdate = req.body.item;
  const desiredQuantity = incomingUpdate.quantity;
  const foundItem = await Product.findById(incomingUpdate.id);

  const updatedQuantity = adjustUpdateQuantity(
    desiredQuantity,
    foundItem?.numberInStock
  );
  const response = setStockMessages(updatedQuantity, desiredQuantity);
  const foundUser = await User.findById(req.userId);
  if (!foundUser) throw new AppError(404, "User not found");
  const userCart = foundUser.cart;
  let updatedCart;
  if (response.outOfStock) {
    updatedCart = userCart.filter(
      (item) => item.product.toString() !== incomingUpdate.id
    );
  }
  const isInCart = !!userCart.find(
    (item) => item.product.toString() === incomingUpdate.id
  );
  if (!isInCart) {
    updatedCart = [
      ...userCart,
      {
        product: incomingUpdate.id,
        quantity: updatedQuantity,
      },
    ];
  } else {
    updatedCart = userCart.map((item) =>
      item.product.toString() !== incomingUpdate.id
        ? item
        : {
            product: incomingUpdate.id,
            quantity: updatedQuantity,
          }
    );
  }
  foundUser.cart = updatedCart;
  const updatedUser = await foundUser.save();
  response.updatedCart = updatedUser.cart;
  response.updatedQuantity = updatedQuantity;
  res.json(response);
};

const getUserCart = async (req, res) => {
  const foundUser = await User.findById(req.userId);
  if (!foundUser) return res.sendStatus(404);
  res.json({ cart: foundUser.cart });
};

const getCartDetails = async (req, res) => {
  const cart = req.body.cartItems;
  const productIds = getObjectIds(cart);
  const foundProducts = await Product.find({ _id: { $in: productIds } });
  res.status(200).json({ cartDetails: foundProducts });
};

const sendRevisedCart = async (req, res) => {
  const { updateMessages, revisedCart } = req;
  res.send({ messages: updateMessages, cart: revisedCart });
};

const removeCartItem = async (req, res, next) => {
  const { id } = req.params;
  const foundUser = await User.findById(req.userId);
  if (!foundUser) throw new AppError(404, "User not found");

  const currentCart = foundUser.cart;
  const updatedCart = currentCart.filter(
    (item) => item.product.toString() !== id
  );
  foundUser.cart = updatedCart;
  await foundUser.save();
  res.json({ updatedCart });
};

const emptyUserCart = async (req, res, next) => {
  const foundUser = await User.findById(req.userId);
  if (!foundUser) throw new AppError(404, "User not found");
  foundUser.cart = [];
  await foundUser.save();
  res.sendStatus(200);
};

module.exports = {
  handleGuestCartUpdate,
  handleAuthCartUpdate,
  getUserCart,
  getCartDetails,
  sendRevisedCart,
  removeCartItem,
  emptyUserCart,
};
