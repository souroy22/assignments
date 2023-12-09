const mongoose = require("mongoose");

const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(`Error while connecting to MongoDB, ERROR: ${error.message}`);
  }
};

module.exports = connectMongoose;
