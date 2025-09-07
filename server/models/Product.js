const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["dress", "food", "others"],
      required: true,
    },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
