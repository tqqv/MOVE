var express = require("express");
const reportRouter = express.Router();
const { verifyUser } = require('../middlewares/verifyToken');
const { reportVideoController, reportLivestreamController, reportChatMessagesController, reportCommentController, getListReportByTypeController } = require("../controllers/reportController");

reportRouter.post('/video', verifyUser, reportVideoController)
reportRouter.post('/livestream', verifyUser, reportLivestreamController)
reportRouter.post('/chatMessages', verifyUser, reportChatMessagesController)
reportRouter.post('/comment', verifyUser, reportCommentController)
// /getListReport?type=video
reportRouter.get('/getListReport', verifyUser, getListReportByTypeController)

module.exports = reportRouter
