const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const authControllers = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const isUserAlreadyExist = await User.findOne({ email });
      if (isUserAlreadyExist) {
        return res
          .status(400)
          .json({ error: "This email id is already exist. Please login" });
      }
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: "foobar",
        },
        process.env.SECRET_KEY
      );
      const hashPassword = await bcrypt.hash(password, saltRounds);
      let newUser = new User({
        name,
        email,
        password: hashPassword,
      });
      newUser = await newUser.save();
      if (!newUser) {
        return res.status(500).json({ error: "Error while creating user" });
      }
      return res.status(200).json({
        user: {
          name: newUser.name,
          email: newUser.email,
          chats: newUser.chats,
          id: newUser._id,
        },
        token,
      });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Server is down. Please try again!" });
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUserAlreadyExist = await User.findOne({ email });
      if (!isUserAlreadyExist) {
        return res.status(400).json({ error: "This email id is not present!" });
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        isUserAlreadyExist.password
      );
      if (!isPasswordCorrect) {
        return res
          .status(400)
          .json({ error: "Emailid or password doesn't match" });
      }
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: "foobar",
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        user: {
          name: isUserAlreadyExist.name,
          email: isUserAlreadyExist.email,
          chats: isUserAlreadyExist.chats,
          id: isUserAlreadyExist._id,
        },
        token,
      });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Server is down. Please try again!" });
    }
  },
};

module.exports = authControllers;
