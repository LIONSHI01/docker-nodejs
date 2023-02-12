const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // encrypt password
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      password: hashPassword,
    });

    // assign session to user object if user is login
    req.session.user = newUser;

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  try {
    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      res.status(404).json({
        status: "fail",
        message: "Wrong username or password",
      });
    }

    // assign session to user object if user is login
    req.session.user = user;

    res.status(201).json({
      status: "success login",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
    });
  }
};
