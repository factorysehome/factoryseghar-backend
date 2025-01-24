const express = require("express");
const cartSchema = require("../models/Cart");
const router = express.Router();

router.post("/addCart", async (req, res) => {
  const { cartItems, customerName, mobile, image } = req.body;

  try {
    const existingCart = await cartSchema.findOne({ mobile });

    if (existingCart) {
      // Find the index of the item in the cart
      const existingItemIndex = existingCart.cartItems.findIndex(
        (item) =>
          item.productName === cartItems.productName &&
          JSON.stringify(item.productDetail) ===
            JSON.stringify(cartItems.productDetail)
      );

      if (existingItemIndex !== -1) {
        const existingItem = existingCart.cartItems[existingItemIndex];
        existingItem.quantity = cartItems.quantity;

        // If the quantity becomes zero or less, remove the item from the cart
        if (existingItem.quantity <= 0) {
          existingCart.cartItems.splice(existingItemIndex, 1);
        }
      } else {
        // Add the item to the cart if it does not already exist and the quantity is greater than zero
        if (cartItems.quantity > 0) {
          existingCart.cartItems.push(cartItems);
        }
      }

      // Update favorites if provided

      await existingCart.save();
      res.status(201).json({
        status: "success",
        message: "Cart updated successfully",
        data: existingCart,
      });
    } else {
      // If the cart does not exist, create a new one only if quantity > 0
      if (cartItems.quantity > 0) {
        const cart = new cartSchema({
          cartItems: [cartItems],

          customerName,
          mobile,
          image,
        });
        await cart.save();
        res.status(201).json({
          status: "success",
          message: "Cart created successfully",
          data: cart,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Cannot create a cart with zero quantity",
        });
      }
    }
  } catch (err) {
    console.error("Error in addCart:", err);
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
