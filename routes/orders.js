const express = require("express");

const router = express.Router();

router.post("/placeOrder", async (req, res) => {
  const { items, totalAmount, cashbackUser } = req.body;

  try {
  } catch (err) {
    res.status(500).json({
      message: "SOmething went wrong",
      err: err,
    });
  }
});
