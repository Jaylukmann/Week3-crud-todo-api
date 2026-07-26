//mongoose db


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("TodoAPI connected to MongoDB successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;