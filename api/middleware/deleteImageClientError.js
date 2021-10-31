const { validationResult } = require('express-validator');
const awsImageService = require('../services/aws-image');

module.exports = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() && req.file && req.file.key) {
    await awsImageService.deleteFile(req.file.key);
  }
  next();
};
