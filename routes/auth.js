const express = require("express");
const router = express.Router();
const authSchema = require("../models/Auth");

router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  try {
    res.status(200).json({ status: "success", data: "otp send successfully" });
  } catch (err) {
    res.status(401).json({ status: "failed", data: err });
  }
});

router.post("/sign-in/verify-otp", async (req, res) => {
  const { fullName, email, mobile, referredBy, otp } = req.body;
  try {
    if (otp !== "2222") {
      res.status(200).json({
        status: "success",
        message: "Invalid otp",
      });
    } else {
      const referralCode = `${fullName.replace(/\s+/g, "")}${mobile.slice(-4)}`;
      const cashbackInfomation = [
        {
          title: "Welcome bonus",
          amount: 100,
          time: new Date().toISOString(),
        },
      ];
      const cashback = 100;
      const newUser = new authSchema({
        fullName,
        email,
        mobile,
        referredBy,
        referralCode,
        cashbackInfomation,
        cashback,
      });
      const response = await newUser.save();
      res.status(200).json({
        status: "success",
        message: "user created successfully",
        data: response,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      err: err,
      message: "Failed to verify the otp",
    });
  }
});

router.post("/login/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;
  try {
    if (otp !== "2222") {
      res.status(200).json({
        status: "success",
        message: "Invalid otp",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "opt verified successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "something went wrong",
    });
  }
});
module.exports = router;
