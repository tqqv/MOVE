var express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { setStatusRequestChannelController, getStatisticController, getDataChartMoneyController, getTop5ChannelController, getTop5UserDepositController } = require("../controllers/adminController");
const adminRoute = express.Router();

adminRoute.get("/getStatistic", verifyAdmin, getStatisticController)
adminRoute.get("/getTop5Channel", verifyAdmin, getTop5ChannelController)
adminRoute.get("/getTop5UserDeposit", verifyAdmin, getTop5UserDepositController)
adminRoute.get("/getDataChartMoney", verifyAdmin, getDataChartMoneyController)
adminRoute.put("/setStatusRequestChannel", verifyAdmin, setStatusRequestChannelController)

module.exports = adminRoute;
