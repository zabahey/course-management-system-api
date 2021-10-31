const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// middleware
const validateClientError = require('../middleware/validateClientError');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const courseValidator = require('../middleware/courseValidator');
const validateObjectIdParam = require('../middleware/validateObjectIdParam');

const CoursesController = require('../controllers/courses');

const Role = require('../models/role');

router.get('/', authenticate, CoursesController.getCourses);

router.post('/', courseValidator(), CoursesController.createNewCourse);

router.get(
  '/:id',
  authenticate,
  validateObjectIdParam(),
  validateClientError,
  CoursesController.getCourseById
);

router.patch(
  '/:id',
  validateObjectIdParam(),
  courseValidator(),
  CoursesController.updateCourse
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.Instructor),
  validateObjectIdParam(),
  validateClientError,
  CoursesController.deleteCourse
);

module.exports = router;
