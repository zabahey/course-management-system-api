const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { param } = require('express-validator');

const validateObjectIdParam = () => {
  return [
    param('id')
      .custom((value) => {
        return ObjectId.isValid(value);
      })
      .withMessage('Provided id is in incorrect format'),
  ];
};

module.exports = validateObjectIdParam;
