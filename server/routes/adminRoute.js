var express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { setStatusRequestChannelController, getStatisticController, getDataChartMoneyController, getTop5ChannelController, getTop5UserDepositController, loginController, logoutController, getAllUsersRequestController } = require("../controllers/adminController");
const { createRepPackageController, editRepPackageController, getRepPackageByIdController, deleteRepPackageController } = require("../controllers/repPackageController");
const { createDonationItemController, getDonationItemByIdController, editDonationItemController, deleteDonationItemController } = require("../controllers/donationItemController");
const adminRoute = express.Router();

//authentication
adminRoute.post("/login", loginController);
adminRoute.get("/logout", verifyAdmin, logoutController);

adminRoute.get("/getStatistic", verifyAdmin, getStatisticController)
adminRoute.get("/getTop5Channel", verifyAdmin, getTop5ChannelController)
adminRoute.get("/getTop5UserDeposit", verifyAdmin, getTop5UserDepositController)
adminRoute.get("/getDataChartMoney", verifyAdmin, getDataChartMoneyController)
adminRoute.put("/setStatusRequestChannel", verifyAdmin, setStatusRequestChannelController)

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

// request channel
adminRoute.get("/requestChannel", verifyAdmin, getAllUsersRequestController);

module.exports = adminRoute;
