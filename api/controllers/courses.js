const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Course = require('../models/course');

exports.getCourses = async (req, res, next) => {
  const { name, start, end } = req.query;

  const minDate = new Date(-8640000000000000);
  const maxDate = new Date(8640000000000000);
  const filterName = name ? name : '';
  const endDate = new Date(+end);

  const filterEndDate = isNaN(endDate) ? maxDate : endDate;
  const startDate = new Date(+start);

  const filterStartDate = isNaN(startDate) ? minDate : startDate;

  const courses = await Course.aggregate([
    {
      $match: {
        name: { $regex: filterName, $options: 'i' },
        startDate: { $gte: filterStartDate },
        endDate: { $lte: filterEndDate },
      },
    },
    {
      $lookup: {
        from: 'userprofiles',
        localField: 'instructor',
        foreignField: 'user',
        as: 'courseInstructor',
      },
    },
    {
      $project: {
        name: '$name',
        description: '$description',
        category: '$category',
        subject: '$subject',
        startDate: '$startDate',
        endDate: '$endDate',
        image: '$image',
        numberOfStudent: '$numberOfStudent',
        instructor: {
          $arrayElemAt: [
            {
              $map: {
                input: '$courseInstructor',
                in: {
                  firstName: '$$this.firstName',
                  lastName: '$$this.lastName',
                  nickName: '$$this.nickName',
                },
              },
            },
            0,
          ],
        },
      },
    },
  ]);

  res.status(200).json({
    code: 200,
    data: courses,
  });
};

exports.getCourseById = async (req, res, next) => {
  const { id } = req.params;

  const courses = await Course.aggregate([
    {
      $match: {
        _id: ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'userprofiles',
        localField: 'instructor',
        foreignField: 'user',
        as: 'courseInstructor',
      },
    },
    {
      $project: {
        name: '$name',
        description: '$description',
        category: '$category',
        subject: '$subject',
        startDate: '$startDate',
        endDate: '$endDate',
        image: '$image',
        numberOfStudent: '$numberOfStudent',
        instructor: {
          $arrayElemAt: [
            {
              $map: {
                input: '$courseInstructor',
                in: {
                  firstName: '$$this.firstName',
                  lastName: '$$this.lastName',
                  nickName: '$$this.nickName',
                },
              },
            },
            0,
          ],
        },
      },
    },
  ]);

  res.status(200).json({
    code: 200,
    data: courses && courses.length < 1 ? null : courses[0],
  });
};

exports.createNewCourse = async (req, res, next) => {
  const { sub: userId } = req.user;
  const {
    name,
    description,
    category,
    subject,
    startDate,
    endDate,
    numberOfStudent,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({
      error: {
        code: 400,
        errors: [
          {
            msg: 'Course image is required',
            param: 'image',
            location: 'body',
          },
        ],
      },
    });
  }

  const course = new Course({
    _id: new mongoose.Types.ObjectId(),
    name,
    description,
    category,
    subject,
    startDate: new Date(+startDate),
    endDate: new Date(+endDate),
    numberOfStudent,
    image: req.file.location,
    instructor: userId,
  });
  try {
    const newCourse = await course.save();
    res.status(201).json({
      code: 201,
      message: 'New course created',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
