require("dotenv").config();
const express = require("express");
// const openai = require("openai");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/v1/message", async (req, res) => {
  try {
    const { msg } = req.body;
    console.log("Body", req.body);
    if (!msg?.trim()) {
      return res.status(400).json({ error: "Please type a proper message" });
    }
    return res.status(200).json({ msg });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({ error: "Server down. Please try again!" });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error while running server, ERROR: ${error.message}`);
    return;
  }
  console.log(`SERVER is successfully running on PORT: ${PORT}`);
});
