const { where } = require("sequelize");
const responseHandler = require("../middlewares/responseHandler");
var { login, register } = require("../services/authService");
var jwt = require("jsonwebtoken");

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

const googleLogin = async(req, res, next) => {
  if(!req.user) {
    return responseHandler(401, null, "User was not authenticated")(req, res, next);
  }
  const {email} = req.user;
  const user = await User.findOne({where: {email}})
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );
  return res.status(200).send({token, user});
} 

module.exports = {
  loginController,
  registerController,
  logoutController,
  googleLogin
};
