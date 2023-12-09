const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
      return res.status(200).json({ newUser });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Server is down. Please try again!" });
    }
  },
};

module.exports = authControllers;
