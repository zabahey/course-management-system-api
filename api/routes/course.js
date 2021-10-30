const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { body, param } = require('express-validator');

const validateClientError = require('../middleware/validate-client-error');
const deleteImageWhenClientError = require('../middleware/delete-image-client-error');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const CoursesController = require('../controllers/courses');
const Role = require('../models/role');

const awsImageService = require('../services/aws-image');

router.get('/', authenticate, CoursesController.getCourses);

router.post(
  '/',
  authenticate,
  authorize(Role.Instructor),
  awsImageService.upload.single('image'),
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isNumeric()
    .withMessage('Start date must be unix epoch timestamp in millisecond')
    .custom((value) => {
      const startDate = new Date(+value);
      return !isNaN(startDate);
    })
    .withMessage('Start date is invalida value')
    .custom((value, { req, location, path }) => {
      const { endDate } = req.body;
      return !endDate || +value < +endDate;
    })
    .withMessage('Start date must before end date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isNumeric()
    .withMessage('Start date must be unix epoch timestamp in millisecond')
    .custom((value) => {
      const endDate = new Date(+value);
      return !isNaN(endDate);
    })
    .withMessage('End date is invalida value')
    .custom((value, { req, location, path }) => {
      const { startDate } = req.body;
      return !startDate || +value >= +startDate;
    })
    .withMessage('End date must after start date'),
  body('numberOfStudent')
    .notEmpty()
    .withMessage('Number of student is required')
    .isNumeric()
    .withMessage('Number of student must be number')
    .isInt({ min: 1 })
    .withMessage('Number of student must more than 0(zero)'),
  deleteImageWhenClientError,
  validateClientError,
  CoursesController.createNewCourse
);

router.get(
  '/:id',
  authenticate,
  param('id')
    .custom((value) => {
      console.log(ObjectId.isValid(value));
      return ObjectId.isValid(value);
    })
    .withMessage('Provided id is in incorrect format'),
  validateClientError,
  CoursesController.getCourseById
);

module.exports = router;
