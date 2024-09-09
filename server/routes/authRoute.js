var express = require("express");
const {
  loginController,
  registerController,
  logoutController,
  sendMailVerifyController,
  verifyAccountController,
  verifyTokenRsController,
  sendMailForgotPass,
  resetPasswordController,
  // getTestController,
} = require("../controllers/authController");
const { verifyUser } = require("../middlewares/verifyToken");

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.get("/logout", verifyUser, logoutController);

// verify email
authRouter.post("/mail-verify", verifyUser, sendMailVerifyController);
authRouter.get("/verify-account/:token", verifyAccountController);
// forgot pasword
authRouter.get("/verify-token/:token", verifyTokenRsController);
authRouter.post("/forgot-password", sendMailForgotPass);
authRouter.post("/reset-password", resetPasswordController);

// authRouter.get("/", getTestController);

module.exports = authRouter;
