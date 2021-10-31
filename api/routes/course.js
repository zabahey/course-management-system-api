const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// middleware
const validateClientError = require('../middleware/validate-client-error');
const authenticate = require('../middleware/authenticate');
const courseValidator = require('../middleware/courseValidator');
const validateObjectIdParam = require('../middleware/validateObjectIdParam');

const CoursesController = require('../controllers/courses');

router.get('/', authenticate, CoursesController.getCourses);

router.post('/', courseValidator(), CoursesController.createNewCourse);

router.get(
  '/:id',
  authenticate,
  validateObjectIdParam(),
  validateClientError,
  CoursesController.getCourseById
);

// router.delete('/:id');

module.exports = router;
