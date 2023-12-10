const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["user", "system"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
