const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    // enum: ['male', 'female', 'other'],
    validate: {
      validator: function (value) {
        return (
          value && ['male', 'female', 'other'].includes(value.toLowerCase())
        );
      },
      message: (props) =>
        `Invalid gender, only male, female, and other are allowed!`,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
