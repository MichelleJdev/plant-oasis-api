const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  handleGuestCartUpdate,
  handleAuthCartUpdate,
  removeCartItem,
  getUserCart,
  sendRevisedCart,
  getCartDetails,
  emptyUserCart,
} = require("../controllers/basket.controllers");

// Validation
const {
  validator,
  cartItemSchema,
  cartSchema,
} = require("../middleware/joiValidation.middleware");

// Middleware
const { verifyAuth } = require("../middleware/auth.middleware");
const {
  syncCartByStock,
  persistRevisedCart,
} = require("../middleware/basket.middleware");

router.post(
  "/guest",
  catchAsync(validator(cartItemSchema)),
  catchAsync(handleGuestCartUpdate)
);
router.patch(
  "/auth",
  catchAsync(verifyAuth),
  catchAsync(validator(cartItemSchema)),
  catchAsync(handleAuthCartUpdate)
);

router.delete("/auth/:id", catchAsync(verifyAuth), catchAsync(removeCartItem));

router.post(
  "/cart-sync/auth",
  catchAsync(verifyAuth),
  catchAsync(validator(cartSchema)),
  catchAsync(syncCartByStock),
  catchAsync(persistRevisedCart),
  catchAsync(sendRevisedCart)
);
router.post(
  "/cart-sync/guest",
  catchAsync(validator(cartSchema)),
  catchAsync(syncCartByStock),
  catchAsync(sendRevisedCart)
);

router.get("/auth", catchAsync(verifyAuth), catchAsync(getUserCart));
router.post(
  "/auth/empty-cart",
  catchAsync(verifyAuth),
  catchAsync(emptyUserCart)
);

router.post(
  "/cart-details",
  catchAsync(validator(cartSchema)),
  catchAsync(getCartDetails)
);

module.exports = router;
