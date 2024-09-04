var express = require("express");
const {
  loginController,
  // getTestController,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/login", loginController);
// authRouter.get("/", getTestController);

module.exports = authRouter;
