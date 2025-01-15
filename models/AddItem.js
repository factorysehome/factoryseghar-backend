const mongoose = require("mongoose");

const AddItem = new mongoose.Schema({
  name: {
    type: String,
  },

  productDetail: {
    type: [],
    // required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model("ItemSchema", AddItem);
