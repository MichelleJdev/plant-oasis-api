const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
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
  description: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 350,
  },
});

categorySchema.virtual("imageUrl").get(function () {
  return `https://res.cloudinary.com/dhsnnabbr/image/upload/v1676002424/${this.image.publicId}.${this.image.format}`;
});
categorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Category", categorySchema);
