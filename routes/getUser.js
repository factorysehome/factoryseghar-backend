const express = require("express");
const router = express.Router();
const authSchema = require("../models/Auth");
router.post("/getProfile", async (req, res) => {
  const { mobile } = req.body;
  try {
    const profile = await authSchema.find({ mobile });
    res.status(200).json({
      message: "User profile fetched successfully",
      data: profile,
    });
  } catch (err) {
    console.error("Error in userProfile:", err.message); // Updated for better readability
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err.message });
  }
});

module.exports = router;
