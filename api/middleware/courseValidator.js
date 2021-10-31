const { body } = require('express-validator');

const authenticate = require('./authenticate');
const authorize = require('./authorize');
const validateClientError = require('./validateClientError');
const deleteImageWhenClientError = require('./deleteImageClientError');

const awsImageService = require('../services/aws-image');

const Role = require('../models/role');

const courseValidator = () => {
  return [
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
  ];
};

module.exports = courseValidator;
