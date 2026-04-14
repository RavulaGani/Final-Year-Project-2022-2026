const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/colourdb");
    console.log("✅ Connected to MongoDB (Local)");
  } catch (error) {
    console.log("❌ Error:", error);
  }
};

module.exports = connectDB;