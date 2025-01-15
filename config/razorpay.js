const Razorpay = require("razorpay");
require("dotenv").config();
// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID, // Replace with your Razorpay Key ID
  key_secret: process.env.RAZOR_KEY_SECRET, // Replace with your Razorpay Key Secret
});

module.exports = razorpayInstance;
