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
const User = require("./models/userModel");
const Chat = require("./models/chatModel");

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

const allowedOrigins = [
  "http://localhost:8080",
  "https://chatbot-goodspace.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectMongoose();

app.use("/api/v1", mainRouter);

io.on("connection", (socket) => {
  socket.on("new-message", async ({ message, userId }) => {
    // console.log("New Message", message);
    // console.log("ID", socket.id);
    // console.log("Message", message);
    const user = await User.findById(userId);
    let chats = user.chats;
    let newChat = new Chat({
      text: message,
      userType: "user",
    });
    newChat = await newChat.save();
    // console.log("Id ---->", newChat._id);
    chats.push(newChat._id);
    const botReply = await getMesssage(message);
    let newBotChat = new Chat({
      text: botReply.message.content,
      userType: "system",
    });
    newBotChat = await newBotChat.save();
    chats.push(newBotChat._id);
    await User.findByIdAndUpdate(userId, { chats });
    // console.log("botReply", botReply.message.content);
    socket.emit("bot-reply", `${botReply.message.content}`);
  });
});
