var express = require("express");
const userRouter = express.Router();

const { getProfileController, editProfileController, changePasswordController, requestChannelController, getRequestChannelController, getListSubscribeOfUser, followChannelController, getAllInforFollowController, checkExistUsername, getProfileByUserNameController } = require("../controllers/userController")
const { verifyUser } = require("../middlewares/verifyToken")

userRouter.get("/getProfileByUsername/:username", getProfileByUserNameController)
userRouter.get("/getProfile", verifyUser, getProfileController)
userRouter.patch("/editProfile", verifyUser, editProfileController)
userRouter.put("/changePassword", verifyUser, changePasswordController)
userRouter.get("/createRequestChannel", verifyUser, requestChannelController)
userRouter.get("/getRequestChannelById", verifyUser, getRequestChannelController)

userRouter.get("/getListFollower/", verifyUser, getListSubscribeOfUser)
userRouter.get("/:username", verifyUser, checkExistUsername)

// unsub/sub
userRouter.post("/followChannel", verifyUser, followChannelController)
userRouter.get("/getAllInforFollow", verifyUser, getAllInforFollowController)

module.exports = userRouter;
