var jwt = require("jsonwebtoken");
var responseHandler = require("./responseHandler");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You're not authenticated",
    });
  }
  // console.log("token here: " + token)
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return responseHandler(400, null, "Tokent is invalid")(req, res, next);
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
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return responseHandler(403, null, "You're not authorize")(req, res, next);
    }
  });
};

// User thì kh xóa được video của User Authorize

module.exports = {
  verifyToken,
  verifyUser,
  verifyStreamer,
  verifyAdmin,
};
