var express = require("express");
const categoryFollowRouter = express.Router();

const { getCateFollowByUserIdController } = require("../controllers/categoryFollowController")
const { verifyUser } = require("../middlewares/verifyToken")

categoryFollowRouter.get("/getAllInforFollow", verifyUser, getCateFollowByUserIdController)

module.exports = categoryFollowRouter;
