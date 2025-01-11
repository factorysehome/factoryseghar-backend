const express = require("express");
const addressSchema = require("../models/Address");
const router = express.Router();

router.post("/addAddresse", async (req, res) => {
  const {
    email,
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
  } = req.body;
  try {
    const newAddress = new addressSchema({
      email,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
    });
    const response = await newAddress.save();
    res
      .status(200)
      .json({ message: "addressa added succesfully", data: response });
  } catch (err) {
    console.log("err in  add address", err.message);
  }
});

router.post("/getAddress", async (req, res) => {
  const { email } = req.body;
  try {
    const allAddress = await addressSchema.find({ email });
    res
      .status(200)
      .json({ message: "address fetched successfully", data: allAddress });
  } catch (err) {
    console.log("err in getAdress", err.message);
  }
});

module.exports = router;
