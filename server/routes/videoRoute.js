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
  getListVideoByFilterController,
  analyticsVideoByIdController,
  getListVideoByChannelController,
  getStateByCountryAndVideoIdController,
} = require('../controllers/videoController');
const { verifyStreamer, verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/getState/:videoId', verifyStreamer, getStateByCountryAndVideoIdController)
router.get('/getVideoAnalytics/:videoId', verifyStreamer, analyticsVideoByIdController)
router.get('/getVideosByFilter', getListVideoByFilterController);
router.get('/getVideosByChannel', verifyStreamer, getListVideoByChannelController);
router.post('/upload-video', verifyStreamer, getUploadLink);
router.post('/upload-thumbnail',verifyStreamer, upload.single('thumbnailPath'), uploadThumbnail);
router.post('/upload-metadata', verifyStreamer, uploadMetadata);
router.post('/save-video', verifyStreamer, saveVideo);
router.post('/get-video', getVideo);
router.post('/check-video-status', checkVideoStatus);
router.patch('/update-video', verifyStreamer, updateVideo);
router.get('/', getAllVideos);
router.get('/:videoId', getVideoByVideoId);
router.get('/channel/:channelId', getVideoByUserId);
router.delete('/delete-video/:videoId', verifyStreamer, deleteVideo);

module.exports = router;
