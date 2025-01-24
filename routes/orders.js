const express = require("express");
const orderSchema = require("../models/Order");
const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");
const authSchema = require("../models/Auth");
const cartSchema = require("../models/Cart");

const router = express.Router();
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

router.post("/placeOrder", async (req, res) => {
  const { items, totalAmount, mobile, address, cashbackUsed, customerName } =
    req.body;

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

    const cart = await cartSchema.findOne({ mobile });

    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (cartItem) =>
          !items.some(
            (orderItem) =>
              JSON.stringify(orderItem.productDetail) ===
              JSON.stringify(cartItem.productDetail)
          )
      );

      await cart.save();
    }
    const user = await authSchema.findOne({ mobile });
    console.log(user);
    user.cashback = user.cashback - cashbackUsed;
    const response = await user.save();
    console.log(response);
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

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  if (originalPrice < 0 || discountPercentage < 0 || discountPercentage > 100) {
    throw new Error(
      "Invalid input: original price and discount percentage must be non-negative, and discount percentage should not exceed 100."
    );
  }

  const discountAmount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discountAmount;

  return discountedPrice.toFixed(2); // Returns the result as a string with 2 decimal places
}

router.post("/getPrice", (req, res) => {
  const { price, cashback } = req.body;

  try {
    if (!price) {
      return res.status(400).json({ error: "Valid price is required." });
    }

    const deliveryFee = 75;
    let finalPrice = {};

    if (price > 2000) {
      finalPrice.price = price;
      finalPrice.discount = "50% off";
      const discountedPrice = calculateDiscountedPrice(price, 50);
      finalPrice.deliveryFee = "0";
      const totalBeforeCashback = discountedPrice;

      // Ensure cashback doesn't exceed the total amount
      finalPrice.cashback =
        cashback && cashback > totalBeforeCashback
          ? totalBeforeCashback
          : cashback || 0;
      finalPrice.totalAmount = totalBeforeCashback - finalPrice.cashback;
    } else {
      finalPrice.price = price;
      finalPrice.discount = "20% off";
      finalPrice.cashback = 0; // No cashback for price ≤ 2000
      finalPrice.deliveryFee = 75;
      const discountedPrice = calculateDiscountedPrice(price, 20);
      finalPrice.totalAmount = discountedPrice + deliveryFee;
    }

    return res.status(200).json(finalPrice);
  } catch (err) {
    console.error("Error in /getPrice:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while calculating the price." });
  }
});

module.exports = router;
