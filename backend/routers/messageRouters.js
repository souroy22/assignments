const express = require("express");
const messageControllers = require("../controllers/messageControllers");
const router = express.Router();

router.get("/get-old-chats/:userid", messageControllers.getOldChats);

module.exports = router;
