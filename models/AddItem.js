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
    data: Buffer, // Binary data for the image
    contentType: String, // MIME type of the image (e.g., 'image/png')
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model("AddItemSchema", AddItem);
