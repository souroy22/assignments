const express = require("express");
const router = express.Router();
const authRouters = require("./authRouters");
const chatRouters = require("./messageRouters");

router.use("/auth", authRouters);
router.use("/chats", chatRouters);

module.exports = router;
