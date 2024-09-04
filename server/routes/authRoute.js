var express = require("express");
const {
  loginController,
  registerController,
  logoutController,
  // getTestController,
} = require("../controllers/authController");
const { verifyUser } = require("../middlewares/verifyToken");

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.get("/logout", verifyUser, logoutController);

// authRouter.get("/", getTestController);

module.exports = authRouter;
