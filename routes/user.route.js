const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  addToFavourites,
  removeFromFavourites,
  getFavouritesData,
} = require("../controllers/user.controllers");

// Middleware
const { verifyAuth } = require("../middleware/auth.middleware");

router.use(catchAsync(verifyAuth));

router.get("/favourites", catchAsync(getFavouritesData));
router.post("/favourites/:id", catchAsync(addToFavourites));
router.delete("/favourites/:id", catchAsync(removeFromFavourites));

module.exports = router;
