const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    required: true,
    unique: true,
    maxlength: 13,
    minlength: 13,
  },
  customer: customerSchema,
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitAmount: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  shippingAddress: {
    country: {
      type: String,
      enum: ["GB"],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      maxlength: 9,
      minlength: 7,
      required: true,
    },
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("formattedTotal").get(function () {
  const totalInPounds = this.total / 100;
  return totalInPounds.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
});

orderSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
