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
router.post("/verify-otp", async (req, res) => {
  const { otp, mobile } = req.body;

  try {
    // Validate OTP
    if (otp !== "2222") {
      return res.status(400).json({
        status: "failed",
        message: "Invalid OTP",
      });
    }

    // Check if user exists
    const existingUser = await authSchema.findOne({ mobile });

    if (existingUser) {
      // User exists, returning response
      return res.status(200).json({
        status: "success",
        message: "OTP verified successfully",
        firstLogin: false,
        data: mobile,
      });
    } else {
      // New user, returning response
      return res.status(201).json({
        status: "success",
        message: "OTP verified successfully",
        firstLogin: true,
        data: mobile,
      });
    }
  } catch (err) {
    // Handle unexpected errors
    console.error("Error during OTP verification:", err);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while verifying OTP",
      error: err.message,
    });
  }
});

router.post("/sign-in", async (req, res) => {
  const { fullName, email, mobile, referredBy } = req.body;

  try {
    const existingUser = await authSchema.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      let message = "User already registered";

      if (existingUser.email === email && existingUser.mobile === mobile) {
        message = "Both email and mobile are already registered";
      } else if (existingUser.email === email) {
        message = "Email is already registered";
      } else if (existingUser.mobile === mobile) {
        message = "Mobile number is already registered";
      }

      return res.status(400).json({
        status: "failed",
        message,
      });
    }

    // Validate referral code
    if (referredBy) {
      const referrer = await authSchema.findOne({ referralCode: referredBy });
      if (!referrer) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid referral code",
        });
      }
    }

    // Generate referral code for the new user
    const referralCode = `${fullName.replace(/\s+/g, "")}${mobile.slice(-4)}`;
    const cashbackInfomation = [
      {
        title: "Welcome bonus",
        amount: 100,
        time: new Date().toISOString(),
      },
    ];
    const cashback = 100;

    // Create and save the new user
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
      message: "User created successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
});

// router.post("/login", async (req, res) => {
//   const { mobile, otp } = req.body;
//   try {
//     if (otp !== "2222") {
//       res.status(200).json({
//         status: "success",
//         message: "Invalid otp",
//       });
//     } else {
//       res.status(200).json({
//         status: "success",
//         message: "opt verified successfully",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: "failed",
//       message: "something went wrong",
//     });
//   }
// });
module.exports = router;
