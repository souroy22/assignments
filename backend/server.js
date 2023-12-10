require("dotenv").config();
const express = require("express");
const router = express.Router();
// const openai = require("openai");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mainRouter = require("./routers");
const connectMongoose = require("./db/mongodbConnection");
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();
// const server = require("http").createServer(app);
const server = app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error while running server, ERROR: ${error.message}`);
    return;
  }
  console.log(`SERVER is successfully running on PORT: ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:8080",
  },
});

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectMongoose();

app.use("/api/v1", mainRouter);

io.on("connection", (socket) => {
  socket.on("new-message", (message) => {
    console.log("New Message", message);
  });
});
