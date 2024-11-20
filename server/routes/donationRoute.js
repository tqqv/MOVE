const express = require("express");
const { verifyAdmin, verifyUser, verifyStreamer } = require("../middlewares/verifyToken");
const { donateLivestreamController, getDonateByLivestreamIdController } = require("../controllers/donationController");
const donationRouter = express.Router();

donationRouter.post('/livestream', verifyUser, donateLivestreamController);
donationRouter.get('/listDonateOfLivestream', verifyStreamer, getDonateByLivestreamIdController);

module.exports = donationRouter;
