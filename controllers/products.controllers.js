const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const AppError = require("../utils/AppError");

//Get ONE
const getProductById = async (req, res) => {
  const id = req.params.id;
  const foundProduct = await Product.findById(id);
  if (!foundProduct) throw new AppError(404, "Product not found");
  res.status(200).json({ product: foundProduct });
};

// Get ALL
const getProducts = async (req, res) => {
  const { category } = req.params;
  const pageSize = parseInt(req.query.pageSize) || 6;
  const page = parseInt(req.query.page) || 1;

  const foundCategory = await Category.findOne({ name: category });
  if (!foundCategory) throw new AppError(404, "Category does not exist");
  const skip = (page - 1) * pageSize;
  const totalProducts = await Product.countDocuments({
    category: foundCategory._id,
    numberInStock: {
      $gte: 1,
    },
  });

  const totalPages = Math.ceil(totalProducts / pageSize);

  const products = await Product.find({
    category: foundCategory._id,
    numberInStock: {
      $gte: 1,
    },
  })
    .skip(skip)
    .limit(pageSize);

  const metaData = {
    totalPages,
    totalProducts,
  };
  res.json({ products, metaData });
};

module.exports = {
  getProductById,
  getProducts,
};
