const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const { addToFavourites } = require("../controllers/user.controllers");

// Middleware

const { verifyAuth } = require("../middleware/auth.middleware");

router.use(catchAsync(verifyAuth));

module.exports = router;
