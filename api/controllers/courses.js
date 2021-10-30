const mongoose = require('mongoose');
const Course = require('../models/course');
const UserProfile = require('../models/userProfile');

exports.getCourses = async (req, res, next) => {
  const courses = await Course.aggregate([
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
