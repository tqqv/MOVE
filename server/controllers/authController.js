const { where } = require("sequelize");
const responseHandler = require("../middlewares/responseHandler");
var { login, register, sendMailVerifyFacebook, verifyAccountFacebook } = require("../services/authService");
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
  getProfile,
  editProfile,
  changePassword,
  requestChannel,
  statusRequestChannel,
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
  const result = await sendMailVerify(email, id);

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

const getProfileController = async (req, res, next) => {
  const userId = req.user.id;
  const result = await getProfile(userId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const editProfileController = async (req, res, next) => {
  const userId = req.user.id;
  const data = req.body;
  const result = await editProfile(userId, data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const changePasswordController = async (req, res, next) => {
  const userId = req.user.id;
  const data = req.body;
  const result = await changePassword(userId, data.oldPass, data.newPass, data.confirmPass)

  responseHandler(result.status, null, result.message)(req, res, next);
}

const requestChannelController = async (req, res, next) => {
  const userId = req.user.id;
  const result = await requestChannel(userId);

  responseHandler(result.status, null, result.message)(req, res, next);
}

const setStatusRqChannel = async (req, res, next) => {
  const data = req.body;
  const result = await statusRequestChannel(data.userId, data.status)

  responseHandler(result.status, null, result.message)(req, res, next);
}

const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });


const googleCallbackController = (req, res, next) => {
  passport.authenticate(
    'google',
    { failureRedirect: '/login', failureMessage: true },
    async (error, user) => {
      const loginResult = await loginByGoogle(error, user);

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
  console.log("token: ", token)
  const accountInfor = req.body;
  const result = await verifyAccountFacebook(accountInfor, token);
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
  getProfileController,
  editProfileController,
  changePasswordController,
  requestChannelController,
  setStatusRqChannel,
  googleLogin,
  googleCallbackController,
  facebookLogin,
  facebookCallback,
  sendMailVerifyFacebookController,
  verifyAccountFacebookController
};
