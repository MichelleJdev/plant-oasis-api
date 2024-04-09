const stripe = require("../config/stripe.config");
const AppError = require("../utils/AppError");
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const verifyStripe = (req, res, next) => {
  try {
    const stripeSignature = req.headers["stripe-signature"];
    if (!stripeSignature) next(new AppError(403, "Unauthorized"));
    const event = stripe.webhooks.constructEvent(
      req.body,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET
    );
    req.event = event;
    next();
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

module.exports = {
  verifyStripe,
};
