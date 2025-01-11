const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  referralCode: { type: String },
  referredBy: { type: String },
  cashback: { type: Number },
  cashbackInfomation: {
    type: [],
  },
});

module.exports = mongoose.model("authSchema", authSchema);
