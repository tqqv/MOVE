const express = require('express');
const { getUploadLink, uploadThumbnail, uploadMetadata, saveVideo, getVideo, checkVideoStatus, updateVideo, getAllVideos, getVideoByUserId, getVideoByVideoId } = require('../controllers/videoController');
const { verifyStreamer, verifyUser } = require("../middlewares/verifyToken");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload-video', verifyStreamer, getUploadLink);
router.post('/upload-thumbnail',verifyStreamer, upload.single('thumbnailPath'), uploadThumbnail);
router.post('/upload-metadata', verifyStreamer, uploadMetadata);
router.post('/save-video', verifyStreamer, saveVideo);  
router.post('/get-video', getVideo);
router.post('/check-video-status', checkVideoStatus);
router.patch('/update-video', verifyStreamer, updateVideo);
router.get('/', getAllVideos);
router.get('/:videoId', getVideoByVideoId);
router.get('/user/:userId', verifyUser, verifyStreamer, getVideoByUserId);
module.exports = router;