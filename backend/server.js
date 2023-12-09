require("dotenv").config();
const express = require("express");
// const openai = require("openai");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mainRouter = require("./routers");
const connectMongoose = require("./db/mongodbConnection");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectMongoose();

app.use("/api/v1", mainRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error while running server, ERROR: ${error.message}`);
    return;
  }
  console.log(`SERVER is successfully running on PORT: ${PORT}`);
});
