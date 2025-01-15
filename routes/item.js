const express = require("express");
const router = express.Router();
const ItemSchema = require("../models/AddItem");
const admin = require("firebase-admin");
require("dotenv").config();
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH); // Replace with your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
const bucket = admin.storage().bucket();

router.post("/addItem", async (req, res) => {
  const { name, image, description, category, productDetail } = req.body;

  try {
    const base64Data = image.split(",")[1]; // Remove "data:image/png;base64," part
    const contentType = image.split(";")[0].split(":")[1]; // Extract content type (e.g., image/jpeg)

    // Create a unique file name for Firebase Storage
    const fileName = `images/${Date.now()}.jpg`; // Change extension based on the content type

    // Upload the image to Firebase Storage
    const buffer = Buffer.from(base64Data, "base64");
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: contentType,
      },
    });

    // Promise to handle upload and get the public URL
    const imageUrl = await new Promise((resolve, reject) => {
      stream.on("error", (error) => reject(error));
      stream.on("finish", async () => {
        // Make the file public (optional, based on your needs)
        await file.makePublic();
        const publicUrl = file.publicUrl();
        resolve(publicUrl);
      });
      stream.end(buffer);
    });
    const newItem = new ItemSchema({
      name,
      productDetail,
      image: imageUrl, // Save URL to MongoDB instead of the binary data
      description,
      category,
    });

    // Save the item to the database
    const savedItem = await newItem.save();
    console.log(savedItem);

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
    let response;
    if (category === "ALL") {
      response = await ItemSchema.find();
    } else {
      response = await ItemSchema.find({ category: category });
    }

    res.status(200).json({
      status: "success",
      message: "Items retrieved successfully",
      data: {
        items: response,
        itemCount: response.length, // Add item count inside the data object
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
