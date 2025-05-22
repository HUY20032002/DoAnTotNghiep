// models/Product.js
const mongoose = require("mongoose");

const Order = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  creator: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
      name: { type: String, required: true },
      variantSize: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],

  totalAmount: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },

  isConfirmedByAdmin: { type: Boolean, default: false },
  confirmedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", Order);
