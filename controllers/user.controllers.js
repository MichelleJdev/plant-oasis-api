const User = require("../models/User.model");
const Product = require("../models/Product.model");
const mongoose = require("mongoose");

const addToFavourites = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const foundUser = await User.findById(userId);
  foundUser.favourites.push(id);
  await foundUser.save();
  res.status(200).json({ favourites: foundUser.favourites });
};
const removeFromFavourites = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const foundUser = await User.findById(userId);
  foundUser.favourites = foundUser.favourites.filter(
    (item) => item.toString() !== id
  );
  await foundUser.save();
  res.status(200).json({ favourites: foundUser.favourites });
};

const getFavouritesData = async (req, res, next) => {
  const { userId } = req;
  const foundUser = await User.findById(userId);
  const foundProducts = await Product.find({
    _id: {
      $in: foundUser.favourites.map((favId) => mongoose.Types.ObjectId(favId)),
    },
  }).populate("category");
  res.status(200).json({ favouritesData: foundProducts });
};

module.exports = { addToFavourites, removeFromFavourites, getFavouritesData };
