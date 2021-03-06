const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const Role = require('../models/role');

const UserController = require('../controllers/user');

const validateClientError = require('../middleware/validateClientError');
const authenticate = require('../middleware/authenticate');

router.post(
  '/signup',
  body('firstName').notEmpty().withMessage('first name is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .custom((value) => {
      return User.find({ username: value })
        .exec()
        .then((user) => {
          if (user.length > 0) {
            return Promise.reject('username already exist');
          }
        });
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long'),
  body('role')
    .custom((value) => {
      return Role.isValidRole(value);
    })
    .withMessage(
      `Invalid role, only ${Role.Student} and ${Role.Instructor} is allowed!`
    ),
  validateClientError,
  UserController.signup
);

router.post(
  '/login',
  body('username').notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('password is required'),
  validateClientError,
  UserController.login
);

router.get('/profile', authenticate, UserController.getUserProfile);

router.patch(
  '/profile',
  authenticate,
  body('firstName').notEmpty().withMessage('firstname is required'),
  body('lastName').notEmpty().withMessage('lastname is required'),
  validateClientError,
  UserController.updateUserProfile
);

module.exports = router;
