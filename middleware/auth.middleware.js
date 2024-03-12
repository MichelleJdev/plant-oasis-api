const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const verifyAuth = async (req, res, next) => {
  const authHeader = req.get("authorization") || req.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "Unauthenticated");
  }
  const accessToken = authHeader.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err) return next(new AppError(403, "Unauthorized"));
      req.userId = decodedToken.user.id;
      next();
    }
  );
};

const ensureNewUser = async (req, res, next) => {
  const userData = req.body.user;
  const existingUser = await User.findOne({
    email: userData.email?.toLowerCase(),
  });

  if (!existingUser) return next();
  throw new AppError(400, "user with given email address already exists");
};

module.exports = {
  ensureNewUser,
  verifyAuth,
};
