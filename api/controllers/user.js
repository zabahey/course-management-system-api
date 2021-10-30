const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const salt = +process.env.BCRYPT_SALT_OR_ROUND;

exports.signup = async (req, res, next) => {
  const { username, password, role } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 400,
          errors: errors.array(),
          message: 'Signup user failed',
        },
      });
    }

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
