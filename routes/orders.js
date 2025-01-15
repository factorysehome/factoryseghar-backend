const express = require("express");
const orderSchema = require("../models/Order");
const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");

const router = express.Router();
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

router.post("/placeOrder", async (req, res) => {
  const { items, totalAmount, mobile, address } = req.body;

  try {
    // Generate a unique orderId for your database
    const orderId = generateOrderId();

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, // Amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${orderId}`,
    });

    // Save the order in your database
    const newOrder = new orderSchema({
      orderId,
      items,
      totalAmount,
      mobile,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    });
    await newOrder.save();

    // Respond to the client with the Razorpay order details
    res.status(200).json({
      message: "Order created successfully",
      razorpayOrderId: razorpayOrder.id,
      orderId: newOrder.orderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

router.post("/payment-verification", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", "nQX5ZKfW0dn1OmVUvTVRBmuQ")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update the order payment status in MongoDB
    const order = await orderSchema.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Payment verified successfully", order });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
