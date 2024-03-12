const AppError = require("../utils/AppError");

const logErrors = (err, req, res, next) => {
  console.log(
    `********Error ${err.statusCode || 500}: ${
      err.message || "something went wrong"
    }********`
  );
  next(err);
};
const handleAppErrors = (err, req, res, next) => {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({ error: err.message });
  next(err);
};

const handleErrors = (err, req, res, next) => {
  if (err.isJoi) return res.status(400).send("data failed validation");
  if (err.type === "StripeSignatureVerificationError") {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return response.sendStatus(400);
  }

  res.status(500).send("something went wrong!");
};

module.exports = {
  logErrors,
  handleErrors,
  handleAppErrors,
};
