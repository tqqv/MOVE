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
  setStatusRqChannel,
  googleLogin,
  googleCallbackController,
  facebookCallback,
  facebookLogin,
  sendMailVerifyFacebookController,
  verifyAccountFacebookController,
} = require("../controllers/authController");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");

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

authRouter.put("/setStatusRQ", verifyAdmin, setStatusRqChannel)
//send mail
authRouter.post("/mail-otp", sendMailVerifyFacebookController);

// SSO google
authRouter.get("/google", googleLogin);
authRouter.get("/google/callback", googleCallbackController);

// SSO facebook
authRouter.get("/facebook", facebookLogin);
authRouter.get("/facebook/callback", facebookCallback);
authRouter.post("/facebook/verify-account/:token", verifyAccountFacebookController);

module.exports = authRouter;
