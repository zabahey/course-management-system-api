const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const Role = require('../models/role');
const UserController = require('../controllers/user');
const validateClientError = require('../middleware/validate-client-error');

router.post(
  '/signup',
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
      console.log(Role.isValidRole(value));
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

module.exports = router;
