var express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { setStatusRequestChannelController, getStatisticController, getDataChartMoneyController, getTop5ChannelController, getTop5UserDepositController, userCountController } = require("../controllers/adminController");
const { createRepPackageController, editRepPackageController, getRepPackageByIdController, deleteRepPackageController } = require("../controllers/repPackageController");
const { createDonationItemController, getDonationItemByIdController, editDonationItemController, deleteDonationItemController } = require("../controllers/donationItemController");
const { loginAdminController } = require("../controllers/authController");
const adminRoute = express.Router();

adminRoute.post("/login", loginAdminController);

adminRoute.get("/userCount", verifyAdmin, userCountController)
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

module.exports = adminRoute;
