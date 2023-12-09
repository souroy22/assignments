const express = require("express");
const router = express.Router();
const authRouters = require("./authRouters");

router.use("/auth", authRouters);

module.exports = router;
