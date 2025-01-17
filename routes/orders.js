const express = require("express");
const orderSchema = require("../models/Order");
const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");
const authSchema = require("../models/Auth");

const router = express.Router();
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

router.post("/placeOrder", async (req, res) => {
  const { items, totalAmount, mobile, address, customerName } = req.body;

  try {
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
      address,
      customerName,
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

    const generatedSignature = crypto
      .createHmac("sha256", "nQX5ZKfW0dn1OmVUvTVRBmuQ")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const order = await orderSchema.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    const user = await authSchema.findOne({ mobile: order?.mobile });
    console.log(user);

    if (user.referredBy && !order.cashbackCredited) {
      const totalOrderByUser = await orderSchema.find({
        mobile: order?.mobile,
      });
      console.log(totalOrderByUser, totalOrderByUser.length);
      let cashbackAmount = totalOrderByUser.length > 1 ? 50 : 100;

      const referredBy = await authSchema.findOne({
        referralCode: user.referredBy,
      });

      const newCashbackInfo = {
        title: "Referral bonus",
        amount: cashbackAmount,
        time: new Date().toISOString(),
        name: user.fullName,
      };

      // Add the new cashback information
      referredBy.cashbackInfomation.push(newCashbackInfo);
      referredBy.cashback += cashbackAmount;
      await referredBy.save();
      order.cashbackCredited = true;
      await order.save();
    }
    res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/orderHistory", async (req, res) => {
  const { mobile } = req.body;
  try {
    const orders = await orderSchema.find({ mobile });
    res
      .status(201)
      .json({ message: "Order fetched successfully", data: orders });
  } catch (err) {
    console.log("err in orderHistory", err.message);
  }
});

module.exports = router;
