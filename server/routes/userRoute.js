var express = require("express");
const userRouter = express.Router();

const { getProfileController, editProfileController, changePasswordController, requestChannelController, getRequestChannelController } = require("../controllers/userController")
const { verifyUser } = require("../middlewares/verifyToken")


userRouter.get("/getProfile", verifyUser, getProfileController)
userRouter.patch("/editProfile", verifyUser, editProfileController)
userRouter.put("/changePassword", verifyUser, changePasswordController)
userRouter.get("/createRequestChannel", verifyUser, requestChannelController)
userRouter.get("/getRequestChannelById", verifyUser, getRequestChannelController)


module.exports = userRouter;
