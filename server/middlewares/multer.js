const multer = require('multer');
const multerS3 = require('multer-s3');
const r2Client = require('../config/r2Config');
const path = require('path');

const s3Storage = multerS3({
  s3: r2Client,
  bucket: process.env.R2_BUCKET_NAME,
  acl: 'public-read', // Or 'private' depending on your bucket settings
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    // Keep the same naming convention: timestamp-originalName
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage: s3Storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

module.exports = { upload };