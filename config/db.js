const mongoose = require("mongoose");
require("dotenv").config();

const dbURI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
