const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');
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
  res.status(200).json({
    message: 'login',
  });
};
