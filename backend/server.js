require("dotenv").config();
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
// const openai = require("openai");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mainRouter = require("./routers");
const connectMongoose = require("./db/mongodbConnection");
const path = require("path");

const PORT = process.env.PORT || 5000;
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

const app = express();
// const server = require("http").createServer(app);
const server = app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error while running server, ERROR: ${error.message}`);
    return;
  }
  console.log(`SERVER is successfully running on PORT: ${PORT}`);
});

async function getMesssage(msg) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: msg }],
    model: "gpt-3.5-turbo",
  });
  // console.log(completion.choices[0]);
  return completion.choices[0];
}

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://chatbot-goodspace.netlify.app", "http://localhost:8080"],
  },
});

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectMongoose();

app.use("/api/v1", mainRouter);
// app.post("/recieve", async (req, res) => {
//   const botReply = await getMesssage(req.body.message);
//   console.log("botReply", botReply);
//   res.json({ botReply });
// });

io.on("connection", (socket) => {
  socket.on("new-message", async (message) => {
    // console.log("New Message", message);
    // console.log("ID", socket.id);
    console.log("Message", message.message);
    const botReply = await getMesssage(message.message);
    console.log("botReply", botReply.message.content);
    socket.emit("bot-reply", `${botReply.message.content}`);
  });
});
