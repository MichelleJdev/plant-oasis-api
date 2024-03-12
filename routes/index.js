const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route.js");
const userRouter = require("./user.route.js");
const productsRouter = require("./products.route.js");
const categoriesRouter = require("./categories.route.js");
const checkoutRouter = require("./checkout.route.js");
const basketRouter = require("./basket.route.js");
const webhooksRouter = require("./webhooks.route.js");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/checkout", checkoutRouter);
router.use("/basket", basketRouter);
router.use("/webhooks", webhooksRouter);

module.exports = router;
