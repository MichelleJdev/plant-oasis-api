const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

//Controller
const {
  checkoutCart,
  checkoutAuthenticated,
} = require("../controllers/checkout.controllers.js");

// Middleware
const {
  validator,
  cartSchema,
} = require("../middleware/joiValidation.middleware");
const { verifyAuth } = require("../middleware/auth.middleware");

router.post("/", catchAsync(validator(cartSchema)), catchAsync(checkoutCart));
router.post(
  "/authenticated",
  catchAsync(verifyAuth),
  catchAsync(validator(cartSchema)),
  catchAsync(checkoutAuthenticated)
);

module.exports = router;
