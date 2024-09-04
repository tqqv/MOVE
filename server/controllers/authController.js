const responseHandler = require("../middlewares/responseHandler");
var { login, register } = require("../services/authService");

const loginController = async (req, res, next) => {
  const loginResult = await login(req.body);
  // console.log(loginResult);
  if (loginResult.cookie) {
    // console.log("hiiiiiiiiiii");
    res.cookie(loginResult.cookie.cookieName, loginResult.cookie.token);
  }
  responseHandler(loginResult.status, loginResult.data, loginResult.message)(
    req,
    res,
    next
  );
};

const registerController = async (req, res, next) => {
  const registerResult = await register(req.body);
  // console.log(registerResult);
  responseHandler(registerResult.status, null, registerResult.message)(
    req,
    res,
    next
  );
};

const logoutController = async (req, res, next) => {
  res.clearCookie("accessToken");
  responseHandler(200, null, "Logout successful")(req, res, next);
};

module.exports = {
  loginController,
  registerController,
  logoutController,
};
