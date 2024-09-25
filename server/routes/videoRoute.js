const express = require('express');
const { getUploadLink, uploadThumbnail, uploadMetadata } = require('../controllers/videoController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload-video', getUploadLink);
router.post('/upload-thumbnail',upload.single('thumbnailPath'), uploadThumbnail);
router.post('/upload-metadata', uploadMetadata);

module.exports = router;