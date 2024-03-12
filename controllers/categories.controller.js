const Category = require("../models/Category.model");

const getAllCategories = async (req, res, next) => {
  const foundCategories = await Category.find({}).exec();
  res.status(200).send(foundCategories);
};

module.exports = { getAllCategories };
