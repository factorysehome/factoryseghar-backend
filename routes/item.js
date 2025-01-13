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
    const base64Data = image.split(",")[1]; // Remove "data:image/png;base64," part
    const binaryData = Buffer.from(base64Data, "base64");
    const contentType = image.split(";")[0].split(":")[1];

    const newItem = new AddItemSchema({
      name,
      variants,
      sku,
      image: {
        data: binaryData,
        contentType,
      },
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

router.post("/getItems", async (req, res) => {
  const { category } = req.body;
  try {
    if (category === "ALL") {
      const response = await AddItemSchema.find();
      console.log(response);

      const newResponse = response.map((item) => {
        let base64Image = null;

        // Convert binary image to Base64
        if (item.image && item.image.data) {
          base64Image = `data:image/png;base64,${item.image.data.toString(
            "base64"
          )}`;
        }

        // Return the required fields and the base64Image
        return {
          name: item.name,
          variants: item.variants,
          sku: item.sku,
          description: item.description,
          category: item.category,
          base64Image, // Optional Base64 image
        };
      });

      res.status(200).json({
        status: "success",
        message: "Items retrieved successfully",
        data: newResponse,
      });
    } else {
      const response = await AddItemSchema.find({ category: category });
      res.status(200).json({
        status: "success",
        message: "Item reterived successfully",
        data: response,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Something went wront",
    });
  }
});

module.exports = router;
