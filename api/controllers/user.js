const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const salt = +process.env.BCRYPT_SALT_OR_ROUND;

exports.signup = async (req, res, next) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password: hashedPassword,
      role,
    });
    const newUser = await user.save();
    res.status(201).json({
      message: 'New user created',
      username: newUser.username,
      id: newUser._id,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  const users = await User.find({ username: username });
  if (users.length < 1) {
    return res.status(401).json({
      code: 401,
      message: 'Authentication failed',
    });
  }

  try {
    const currentUser = users[0];
    const isValidPassword = await bcrypt.compare(
      password,
      currentUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        message: 'Authentication failed',
      });
    }

    const token = jwt.sign(
      {
        username: currentUser.username,
        role: currentUser.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1h',
        subject: currentUser._id.toString(),
      }
    );
    res.status(200).json({
      coed: 200,
      token,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
