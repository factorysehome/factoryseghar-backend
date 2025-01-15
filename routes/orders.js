const express = require("express");
const orderSchema = require("../models/Order");

const router = express.Router();
function generateOrderId() {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const random = Math.floor(Math.random() * 1000); // Random number between 0-999
  return `ORD-${timestamp}-${random}`;
}

router.post("/placeOrder", async (req, res) => {
  const { items, totalAmount, mobile, address } = req.body;

  try {
    const newOrder = new orderSchema({
      orderId: generateOrderId(),
      items,
      totalAmount,
      mobile,
      address,
    });
    await newOrder.save();
  } catch (err) {
    res.status(500).json({
      message: "SOmething went wrong",
      err: err,
    });
  }
});
