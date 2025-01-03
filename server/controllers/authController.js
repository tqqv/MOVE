const responseHandler = require("../middlewares/responseHandler");
const { setCookies, clearCookies } = require("../utils/cookies.js");
var { login, register, sendMailVerifyFacebook, verifyAccountFacebook, loginAdmin, getBanned } = require("../services/authService");
var { loginByGoogle } = require("../services/googleService.js");
var { loginByFacebook } = require("../services/facebookService.js");
var jwt = require("jsonwebtoken");
const passport = require('passport');
require('../utils/google/passport.js');
require('../utils/facebook/passport.js');

var {
  login,
  register,
  sendMailVerify,
  verifyAccount,
  forgotPassword,
  resetPassword,
  verifyTokenRs,
} = require("../services/authService");

// authenticate
const loginController = async (req, res, next) => {
  const loginResult = await login(req.body);

  if (loginResult.cookie) {
    setCookies([
      {name: loginResult.cookie.cookieName, value: loginResult.cookie.token, days: 15, options: { httpOnly: true }},
      {name: 'isLogin', value: 'true', days: 15},
      {name: 'role', value: loginResult.data.role, days: 15}
    ])(req, res);
  }

  responseHandler(loginResult.status, loginResult.data, loginResult.message)(
    req,
    res,
    next
  );
};

const loginAdminController = async (req, res, next) => {
  const loginResult = await loginAdmin(req.body);

  if (loginResult.cookie) {
    setCookies([
      {name: loginResult.cookie.cookieName, value: loginResult.cookie.token, days: 15, options: { httpOnly: true }},
      {name: 'isLoginAdmin', value: 'true', days: 15}
    ])(req, res);
  }

  responseHandler(loginResult.status, loginResult.data, loginResult.message)(
    req,
    res,
    next
  );
};

const registerController = async (req, res, next) => {
  const registerResult = await register(req.body);
  responseHandler(registerResult.status, null, registerResult.message)(
    req,
    res,
    next
  );
};

const logoutController = async (req, res, next) => {
  clearCookies([
    {name: 'accessToken', options: { httpOnly: true }},
    {name: 'isLogin'},
    {name: 'role'}
  ])(req, res, next);

  clearCookies([
    {name: 'accessTokenAdmin', options: { httpOnly: true }},
    {name: 'isLoginAdmin'}
  ])(req, res, next);

  responseHandler(200, null, "Logout successful")(req, res, next);
};

const logoutAdminController = async (req, res, next) => {
  clearCookies([
    {name: 'accessTokenAdmin', options: { httpOnly: true }},
    {name: 'isLoginAdmin'}
  ])(req, res, next);

  responseHandler(200, null, "Logout successful")(req, res, next);
};



//Verify account
const sendMailVerifyController = async (req, res, next) => {
  const email = req.body.email;
  const id = req.user.id;
  const result = await sendMailVerify(email, id);

  responseHandler(result.status, null, result.message)(req, res, next);
};

const verifyAccountController = async (req, res, next) => {
  const token = req.params.token;
  const userId = req.user.id;
  const result = await verifyAccount(userId, token);

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

const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });


const googleCallbackController = (req, res, next) => {
  passport.authenticate(
    'google',
    { failureMessage: true },
    async (error, user) => {
      if (error || !user) {
        return res.redirect(process.env.CLIENT_HOST);
      }
      const loginResult = await loginByGoogle(error, user);

      if (loginResult.cookie) {
        setCookies([
          {name: loginResult.cookie.cookieName, value: loginResult.cookie.token, days: 15, options: {httpOnly: true}},
          {name: 'isLogin', value: 'true', days: 15},
          {name: 'role', value: loginResult.data.role, days: 15}
        ])(req, res);
        res.redirect(process.env.CLIENT_HOST);
      }
    }
  )(req, res, next);
};

// facebook
const facebookLogin = passport.authenticate('facebook');

const facebookCallback = (req, res, next) => {
  passport.authenticate(
    'facebook',
    { failureRedirect: '/login', failureMessage: true },
    async (error, user) => {
      if(!user.email) {
        return responseHandler(
          401,
          user,
          "No email exist with the facebook account"
        )(req, res, next);
      } else {
        const loginResult = await loginByFacebook(error, user);
        if (loginResult.cookie) {
          res.cookie(loginResult.cookie.cookieName, loginResult.cookie.token, {
            httpOnly: true,
            expires: loginResult.cookie.expires,
          })
        }
      return responseHandler(
        loginResult.status,
        loginResult.data,
        loginResult.message
      )(req, res, next);
    }
  }
)(req, res, next);
};

// facebook verify account
const sendMailVerifyFacebookController = async (req, res, next) => {
  const email = req.body.email;
  const fullName = req.body.displayName;
  const result = await sendMailVerifyFacebook(email, fullName );
  if (result.cookie) {
    res.cookie(result.cookie.cookieName, result.cookie.token);
  }
  responseHandler(result.status, null, result.message)(req, res, next);
};


const verifyAccountFacebookController = async (req, res, next) => {
  const { token } = req.params;
  const accountInfor = req.body;
  const result = await verifyAccountFacebook(accountInfor, token);
  if (result.cookie) {
    res.cookie(result.cookie.cookieName, result.cookie.token);
  }
  responseHandler(result.status, null, result.message)(req, res, next);
};

const getBannedController = async (req, res, next) => {
  const userId = req.user.id;
  const result = await getBanned(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
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
  googleLogin,
  googleCallbackController,
  facebookLogin,
  facebookCallback,
  sendMailVerifyFacebookController,
  verifyAccountFacebookController,
  loginAdminController,
  getBannedController,
  logoutAdminController
};
