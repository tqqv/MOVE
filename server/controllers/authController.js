const responseHandler = require("../middlewares/responseHandler");

var {
  login,
  register,
  sendMailVeriry,
  verifyAccount,
  forgotPassword,
  resetPassword,
  verifyTokenRs,
} = require("../services/authService");

// authenticate
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


//Verify account
const sendMailVerifyController = async (req, res, next) => {
  const email = req.body.email;
  // console.log("controller:", email);
  const id = req.user.id;
  const result = await sendMailVeriry(email, id);

  responseHandler(result.status, null, result.message)(req, res, next);
};

const verifyAccountController = async (req, res, next) => {
  const token = req.params.token;
  // console.log("test: ", token);
  const result = await verifyAccount(token);

  responseHandler(result.status, null, result.message)(req, res, next);
};

// Forgot pasword
const verifyTokenRsController = async (req, res, next) => {
  const token = req.params.token;
  const result = await verifyTokenRs(token);

  responseHandler(result.status, result.data, result.message)(req, res, next);
};

const sendMailForgotPass = async (req, res, next) => {
  const email = req.body.email;
  const result = await forgotPassword(email);

  responseHandler(result.status, null, result.message)(req, res, next);
};

const resetPasswordController = async (req, res, next) => {
  const data = req.body;

  const result = await resetPassword(
    data.email,
    data.userId,
    data.newPassword,
    data.confirmPassword
  );
  responseHandler(result.status, null, result.message)(req, res, next);
};

module.exports = {
  loginController,
  registerController,
  logoutController,
  sendMailVerifyController,
  verifyAccountController,
  sendMailForgotPass,
  resetPasswordController,
  verifyTokenRsController,
};