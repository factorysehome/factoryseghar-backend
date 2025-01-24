const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  items: [
    {
      productName: { type: String, required: true },
      image: { type: String },
      productDetail: { type: {} },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  cashbackUsed: { type: Number },
  address: {
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      default: "",
    },
    landMark: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  cashbackCredited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
