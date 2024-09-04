const responseHandler = require("../middlewares/responseHandler");
var { login, getTest } = require("../services/authService");

const loginController = async (req, res) => {
  const loginResult = await login(req.body);
  res.status(200).send(loginResult);
};

// const getTestController = async (req, res) => {
//   const getTestData = await getTest();
//   res.status(200).send(getTestData);
// };

module.exports = {
  loginController,
  // getTestController,
};
