var express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { setStatusRequestChannelController, getStatisticController, getDataChartMoneyController, getTop5ChannelController, getTop5UserDepositController, userCountController, getAllUsersRequestController, getAllUserController, getUserByIdController, editProfileUserController, getListVideoByChannelIdController, EditVideoByIdController, deleteVideoByIdController, getListPaymentByUserIdController, unbanAccountController, unbanChannelController, revenueController, getListUserPayInController, getListUserPayOutController } = require("../controllers/adminController");
const { createRepPackageController, editRepPackageController, getRepPackageByIdController, deleteRepPackageController } = require("../controllers/repPackageController");
const { createDonationItemController, getDonationItemByIdController, editDonationItemController, deleteDonationItemController } = require("../controllers/donationItemController");
const { getListReportVideoController, getListReportCommentController, getListReportLivestreamController, getListReportAccountController, getListReportChannelController, actionReportController, getReportDetailController } = require("../controllers/reportController");
const { loginAdminController } = require("../controllers/authController");
const adminRoute = express.Router();

adminRoute.post("/login", loginAdminController);

adminRoute.get("/getListUserPayIn", verifyAdmin, getListUserPayInController)
adminRoute.get("/getListUserPayOut", verifyAdmin, getListUserPayOutController)
adminRoute.get("/revenue", verifyAdmin, revenueController)
adminRoute.get("/userCount", verifyAdmin, userCountController)
adminRoute.get("/getStatistic", verifyAdmin, getStatisticController)
adminRoute.get("/getTop5Channel", verifyAdmin, getTop5ChannelController)
adminRoute.get("/getTop5UserDeposit", verifyAdmin, getTop5UserDepositController)
adminRoute.get("/getDataChartMoney", verifyAdmin, getDataChartMoneyController)
adminRoute.put("/setStatusRequestChannel", verifyAdmin, setStatusRequestChannelController)

////////////////////////// User Management //////////
adminRoute.get("/getAllUser", verifyAdmin, getAllUserController)
adminRoute.get("/getUserById/:userId", verifyAdmin, getUserByIdController)
adminRoute.patch("/editProfileUser/:userId", verifyAdmin, editProfileUserController)
adminRoute.get("/getListVideoByUser/:channelId", verifyAdmin, getListVideoByChannelIdController)
adminRoute.patch('/editVideoById', verifyAdmin, EditVideoByIdController);
adminRoute.delete('/deleteVideoById/:videoId', verifyAdmin, deleteVideoByIdController);
adminRoute.get("/getListPaymentByUserId/:userId", verifyAdmin, getListPaymentByUserIdController)

////////////////////////// REP PACKAGE ////////////
adminRoute.post("/createRepPackage", verifyAdmin, createRepPackageController)
adminRoute.get("/getRepPackageById/:repPackageId", verifyAdmin, getRepPackageByIdController)
adminRoute.patch("/editRepPackage/:repPackageId", verifyAdmin, editRepPackageController)
adminRoute.delete("/deleteRepPackage/:repPackageId", verifyAdmin, deleteRepPackageController)

///////////////// Donation Item /////////////
adminRoute.post("/createDonationItem", verifyAdmin, createDonationItemController)
adminRoute.get("/getDonationItemById/:donationItemId", verifyAdmin, getDonationItemByIdController)
adminRoute.patch("/editDonationItem/:donationItemId", verifyAdmin, editDonationItemController)
adminRoute.delete("/deleteDonationItem/:donationItemId", verifyAdmin, deleteDonationItemController)

///////// Report //////////
adminRoute.get("/getListReportVideo", verifyAdmin, getListReportVideoController)
adminRoute.get("/getListReportComment", verifyAdmin, getListReportCommentController)
adminRoute.get("/getListReportLivestream", verifyAdmin, getListReportLivestreamController)
adminRoute.get("/getListReportAccount", verifyAdmin, getListReportAccountController)
adminRoute.get("/getListReportChannel", verifyAdmin, getListReportChannelController)
adminRoute.get("/getReportDetail", verifyAdmin, getReportDetailController)
adminRoute.post("/actionReport", verifyAdmin, actionReportController)

//////////// Unban //////////////////
adminRoute.post("/unbanUser/:userId", verifyAdmin, unbanAccountController)
adminRoute.post("/unbanChannel/:channelId", verifyAdmin, unbanChannelController)

// request channel
adminRoute.get("/requestChannel", verifyAdmin, getAllUsersRequestController);


module.exports = adminRoute;
