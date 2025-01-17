const express = require("express");
const cartSchema = require("../models/Cart");
const router = express.Router();

router.post("/addCart", async (req, res) => {
  const { cartItems, customerName, mobile, favoritesItems } = req.body;
  try {
    const existingCart = await cartSchema.findOne({ mobile });
    if (existingCart) {
      existingCart.cartItems = cartItems;
      existingCart.favoritesItems = favoritesItems;
      await existingCart.save();
      res.status(201).json({
        status: "success",
        message: "item added in cart successfully",
        data: existingCart,
      });
    } else {
      const cart = new cartSchema({
        cartItems,
        favoritesItems,
        customerName,
        mobile,
      });
      await cart.save();
      res.status(201).json({
        status: "success",
        message: "Item added in cart successfully",
        data: cart,
      });
    }
  } catch (err) {
    console.log("err in addcart");
    res.status(500).json({
      err: err.message,
      status: "failed",
    });
  }
});

router.post("/getCart", async (req, res) => {
  const { mobile } = req.body;
  try {
    const cart = await cartSchema.findOne({ mobile });
    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      err: err.message,
    });
  }
});
module.exports = router;
