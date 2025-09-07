const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    address: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zip: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
