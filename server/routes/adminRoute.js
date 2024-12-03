var express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { setStatusRequestChannelController } = require("../controllers/adminController");
const adminRoute = express.Router();

adminRoute.put("/setStatusRequestChannel", verifyAdmin, setStatusRequestChannelController)

module.exports = adminRoute;
