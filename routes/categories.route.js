const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

const { getAllCategories } = require("../controllers/categories.controller");

router.get("/", catchAsync(getAllCategories));

module.exports = router;
