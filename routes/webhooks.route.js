const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

// Controllers
const { handleCheckoutSuccess } = require("../controllers/webhooks.controller");

// Middleware

const { verifyStripe } = require("../middleware/webhooks.middleware");

router.post(
  "/checkout-success",
  verifyStripe,
  catchAsync(handleCheckoutSuccess)
);

module.exports = router;
