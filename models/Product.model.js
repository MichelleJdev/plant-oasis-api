const mongoose = require("mongoose");
const Category = require("./Category.model");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 350,
  },
  unitAmount: {
    type: Number,
    required: true,
    max: 100000,
  },
  numberInStock: {
    type: Number,
    required: true,
  },
  image: {
    publicId: {
      type: String,
      required: true,
      default: "dev_testing/ecommerce-app/default-image",
    },
    format: {
      type: String,
      required: true,
      enum: ["jpg", "jpeg", "png"],
      default: "jpg",
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    validate: {
      validator: async (value) => {
        try {
          const category = await Category.findById(value);
          return category !== null;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      message: "cannot create product with category that does not exist",
    },

    required: true,
  },
});

productSchema.virtual("imageUrl").get(function () {
  return `https://res.cloudinary.com/dhsnnabbr/image/upload/v1676002424/${this.image.publicId}.${this.image.format}`;
});

productSchema.virtual("formattedPrice").get(function () {
  const amountInPounds = this.unitAmount / 100;
  return amountInPounds.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
});
productSchema.virtual("inStockStatus").get(function () {
  return this.numberInStock >= 1;
});
productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
