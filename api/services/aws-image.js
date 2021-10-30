const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_REGION,
});
const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimwetype === 'image/png') {
    cb(null, true);
  } else {
    //reject a file
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const storage = multerS3({
  // Permissions
  acl: 'public-read',
  s3,
  bucket: process.env.S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + '_' + file.originalname);
  },
});

const upload = multer({
  fileFilter,
  storage,
});

const deleteFile = async (key) => {
  try {
    const result = await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
      .promise();
    console.log(result);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  upload,
  deleteFile,
};
