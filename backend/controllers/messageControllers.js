const User = require("../models/userModel");

const messageControllers = {
  getOldChats: async (req, res) => {
    try {
      const oldChats = await User.findById(req.params.userid).populate("chats");
      console.log("Old Chats", oldChats);
      return res.status(200).json({ chats: oldChats.chats });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Server is down. Please try again!" });
    }
  },
};

module.exports = messageControllers;
