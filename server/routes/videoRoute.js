const express = require('express');
const { getUploadLink, uploadThumbnail } = require('../controllers/videoController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload-video', getUploadLink);
router.post('/upload-thumbnail',upload.single('thumbnailPath'), uploadThumbnail);

module.exports = router;