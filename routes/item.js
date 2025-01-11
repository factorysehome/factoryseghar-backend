const express = require("express");
const router = express.Router();
const AddItemSchema = require("../models/AddItem");

router.post("/addItem", async (req, res) => {
  const { name, variants, sku, image, description, category } = req.body;

  try {
    if (!variants || !sku) {
      return res
        .status(400)
        .json({ message: "Variants and SKU are required." });
    }

    const newItem = new AddItemSchema({
      name,
      variants,
      sku,
      image,
      description,
      category,
    });

    // Save the item to the database
    const savedItem = await newItem.save();

    res.status(201).json({
      message: "Item added successfully",
      data: savedItem,
    });
  } catch (err) {
    console.error("Error in addItem API:", err.message);
    res.status(500).json({
      message: "Error adding item",
      error: err.message,
    });
  }
});

module.exports = router;
