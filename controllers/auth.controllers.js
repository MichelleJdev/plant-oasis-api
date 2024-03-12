const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = "10m";
const REFRESH_TOKEN_EXPIRATION = "30m";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 60 * 1000,
};

// REGISTER
const registerUser = (req, res, next) => {
  const SALT_ROUNDS = 12;
  const { user } = req.body;
  bcrypt.hash(user.password, SALT_ROUNDS, async (err, hashedPass) => {
    try {
      if (err) return next(err);
      const newUser = new User({
        ...user,
        password: hashedPass,
        email: user.email.toLowerCase(),
      });
      const createdUser = await newUser.save();
      res.status(201).json({ name: createdUser.name });
    } catch (error) {
      next(error);
    }
  });
};

// LOGIN
const handleLogin = async (req, res, next) => {
  const { email, password, cart } = req.body.user;
  const foundUser = await User.findOne({ email: email.toLowerCase() });
  if (!foundUser) throw new AppError(401, "Incorrect email or password");
  const validMatch = await bcrypt.compare(password, foundUser.password);
  if (!validMatch) throw new AppError(401, "Incorrect email or password");
  const accessToken = jwt.sign(
    {
      user: {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    {
      userId: foundUser._id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    }
  );

  if (cart.length >= 1) {
    cart.forEach((cartItem) => {
      const foundItem = foundUser.cart.find(
        (userCartItem) =>
          userCartItem.product.toString() === cartItem.product.toString()
      );
      if (foundItem) {
        foundItem.quantity += cartItem.quantity;
      } else {
        foundUser.cart.push(cartItem);
      }
    });
    await foundUser.save();
  }

  res.cookie("jwt", refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    accessToken,
    name: foundUser.name,
    email: foundUser.email,
  });
};

// REFRESH
const handleRefresh = async (req, res, next) => {
  const refreshToken = req.cookies["jwt"];
  if (!refreshToken) throw new AppError(401, "Unauthenticated");
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decodedToken) => {
    try {
      if (err) throw new AppError(403, "Unauthorized");
      const foundUser = await User.findById(decodedToken.userId);
      if (!foundUser) throw new AppError(401, "Unauthenticated");
      const newAccessToken = jwt.sign(
        {
          user: {
            id: foundUser._id,
            isAdmin: foundUser.isAdmin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRATION }
      );
      res.status(200).json({
        accessToken: newAccessToken,
        isAdmin: foundUser.isAdmin,
        name: foundUser.name,
        email: foundUser.email,
      });
    } catch (error) {
      next(error);
    }
  });
};

// LOGOUT
const handleLogout = (req, res) => {
  const refreshCookie = req.cookies?.jwt;
  if (!refreshCookie) return res.sendStatus(204);
  res.clearCookie("jwt", REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ message: "Cleared refresh cookie" });
};

module.exports = {
  registerUser,
  handleLogin,
  handleRefresh,
  handleLogout,
};
