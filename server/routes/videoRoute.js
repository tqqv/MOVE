const express = require('express');
const { getUploadLink,
  uploadThumbnail,
  uploadMetadata,
  saveVideo,
  getVideo,
  checkVideoStatus,
  updateVideo,
  getAllVideos,
  getVideoByUserId,
  getVideoByVideoId,
  deleteVideo,
  getListTopVideoController,
  getListVideoHighestRateController} = require('../controllers/videoController');
const { verifyStreamer, verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/getVideosHighestRate', getListVideoHighestRateController);
router.get('/getListTopVideo', getListTopVideoController);
router.post('/upload-video', verifyStreamer, getUploadLink);
router.post('/upload-thumbnail',verifyStreamer, upload.single('thumbnailPath'), uploadThumbnail);
router.post('/upload-metadata', verifyStreamer, uploadMetadata);
router.post('/save-video', verifyStreamer, saveVideo);
router.post('/get-video', getVideo);
router.post('/check-video-status', checkVideoStatus);
router.patch('/update-video', verifyStreamer, updateVideo);
router.get('/', getAllVideos);
router.get('/:videoId', getVideoByVideoId);
router.get('/channel/:channelId', verifyUser, verifyStreamer, getVideoByUserId);
router.delete('/', verifyStreamer, deleteVideo);

module.exports = router;
