const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" }, // "pending", "paid", "shipped", etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
