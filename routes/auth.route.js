const router = require("express").Router();

// Controllers
const {
  registerUser,
  handleLogin,
  handleRefresh,
  handleLogout,
} = require("../controllers/auth.controllers");

// Middleware
const { ensureNewUser } = require("../middleware/auth.middleware");
const {
  validator,
  userSchema,
  loginSchema,
} = require("../middleware/joiValidation.middleware");

// Utils
const catchAsync = require("../utils/catchAsync");

router.post(
  "/register",
  catchAsync(validator(userSchema)),
  catchAsync(ensureNewUser),
  registerUser
);

router.post(
  "/login",
  catchAsync(validator(loginSchema)),
  catchAsync(handleLogin)
);

router.get("/refresh", catchAsync(handleRefresh));
router.get("/logout", handleLogout);

module.exports = router;
