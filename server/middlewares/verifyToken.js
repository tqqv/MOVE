var jwt = require("jsonwebtoken");
var responseHandler = require("./responseHandler");
const { clearCookies } = require("../utils/cookies");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You're not authenticated",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      clearCookies([
        {name: 'accessToken', options: { httpOnly: true }},
        {name: 'isLogin'}
      ])(req, res, next);
      return responseHandler(400, null, "Token is invalid")(req, res, next);
    }
    req.user = user;
    next();
  });
};

const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies.accessTokenAdmin;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You're not authenticated",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      clearCookies([
        {name: 'accessTokenAdmin', options: { httpOnly: true }},
        {name: 'isLoginAdmin'}
      ])(req, res, next);
      return responseHandler(400, null, "Token is invalid")(req, res, next);
    }
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "user" || req.user.role === "streamer") {
      next();
    } else {
      return responseHandler(403, null, "You're not authorize")(req, res, next);
    }
  });
};

const verifyStreamer = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "streamer") {
      next();
    } else {
      return responseHandler(403, null, "You're not authorize")(req, res, next);
    }
  });
};


const verifyAdmin = (req, res, next) => {
  verifyTokenAdmin(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return responseHandler(403, null, "You're not authorize")(req, res, next);
    }
  });
};


module.exports = {
  verifyToken,
  verifyUser,
  verifyStreamer,
  verifyAdmin,
};
