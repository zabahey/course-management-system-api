const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { param } = require('express-validator');

// middleware
const validateClientError = require('../middleware/validate-client-error');
const authenticate = require('../middleware/authenticate');
const courseValidator = require('../middleware/courseValidator');

const CoursesController = require('../controllers/courses');


router.get('/', authenticate, CoursesController.getCourses);

router.post(
  '/',
  courseValidator(),
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
