const Razorpay = require("razorpay");

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
  key_secret: "YOUR_RAZORPAY_KEY_SECRET", // Replace with your Razorpay Key Secret
});

module.exports = razorpayInstance;
