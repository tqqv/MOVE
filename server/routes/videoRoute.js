const express = require('express');
const { getUploadLink } = require('../controllers/videoController');
const router = express.Router();

router.post('/upload-video', getUploadLink);

module.exports = router;