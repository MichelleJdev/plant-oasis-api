const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  getProductById,
  getProducts,
} = require("../controllers/products.controllers");

const {
  queryValidator,
  storeQueriesSchema,
} = require("../middleware/joiValidation.middleware");

router.get("/details/:id", catchAsync(getProductById));
router
  .route("/:category")
  .get(catchAsync(queryValidator(storeQueriesSchema)), catchAsync(getProducts));

module.exports = router;
