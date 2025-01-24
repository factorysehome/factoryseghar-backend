const mongoose = require("mongoose");

const cart = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },

  cartItems: [
    {
      image: {
        type: String,
      },
      productName: { type: String, required: true },
      productDetail: { type: {} },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("cart", cart);
