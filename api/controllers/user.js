const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserProfile = require('../models/userProfile');

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
      code: 201,
      data: {
        username: newUser.username,
        id: newUser._id,
      },
      message: 'New user created',
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
      data: {
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

exports.getUserProfile = async (req, res, next) => {
  const { sub } = req.user;

  const userProfiles = await UserProfile.find({ user: sub }).select(
    'firstName lastName gender nickName birthday'
  );

  if (userProfiles.length < 1) {
    return res.status(200).json({
      code: 200,
      data: {
        firstName: '',
        lastName: '',
        gender: '',
        nickName: '',
        birthday: new Date().getTime(),
      },
    });
  }

  const currentUserProfile = userProfiles[0];

  res.status(200).json({
    code: 200,
    data: {
      firstName: currentUserProfile.firstName,
      lastName: currentUserProfile.lastName,
      gender: currentUserProfile.gender,
      nickName: currentUserProfile.nickName,
      birthday: new Date(currentUserProfile.birthday).getTime(),
    },
  });
};

exports.updateUserProfile = async (req, res, next) => {
  const { sub } = req.user;

  const users = await User.find({ _id: sub });

  if (users.length < 1) {
    return res.status(404).json({
      code: 404,
      message: 'User not found',
    });
  }

  const updateOps = {};

  for (const key in req.body) {
    const value = req.body[key];
    if (value != null) {
      if (key === 'birthday') {
        updateOps[key] = new Date(value);
      } else {
        updateOps[key] = req.body[key];
      }
    }
  }

  try {
    const result = await UserProfile.updateOne(
      {
        user: sub,
      },
      {
        $set: updateOps,
      },
      { upsert: true, runValidators: true }
    );

    res.status(200).json({
      code: 200,
      message: 'User profile updated',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
