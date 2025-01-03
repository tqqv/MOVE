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
  increaseViewController,
  updateViewtimeController,
  getVideoWatchAlsoController,
  deleteMultipleVideos,
  getTopVideoController,
  getStateByCountryAndVideoIdFromIpController,
  getVideoYouMayLikeController,
  reupStreamController,
  getLatestReupStreamController,
  getVideoByChannelAndTitleController
} = require('../controllers/videoController');
const { verifyStreamer, verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/getVideoYouMayLike/:userId', getVideoYouMayLikeController);
router.get('/getTopvideo', getTopVideoController);
router.get('/getVideoWatchAlso', getVideoWatchAlsoController);
router.get('/getState/:videoId', verifyStreamer, getStateByCountryAndVideoIdController)
router.get('/getStateFromIP/:videoId', verifyStreamer, getStateByCountryAndVideoIdFromIpController)
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
router.get('/latestReup', getLatestReupStreamController);
router.get('/', getAllVideos);
router.get('/:videoId', getVideoByVideoId);
router.get('/channel/:channelId', getVideoByUserId);
router.get('/channel/search/:channelId', getVideoByChannelAndTitleController);
router.delete('/delete-video/:videoId', verifyStreamer, deleteVideo);
router.delete('/delete-videos', verifyStreamer, deleteMultipleVideos);
router.post('/reup', verifyStreamer, reupStreamController);

// Tăng View ở đây
router.post('/increaseView', increaseViewController);
router.post('/updateViewTime', verifyUser, updateViewtimeController);


module.exports = router;
