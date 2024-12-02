const responseHandler = require("../middlewares/responseHandler");
const { setStatusRequestChannel } = require("../services/adminService");

const setStatusRequestChannelController = async (req, res, next) => {
  const data = req.body;
  const result = await setStatusRequestChannel(data.userId, data.status, data.text || null)

  responseHandler(result.status, null, result.message)(req, res, next);
}

module.exports = {
  setStatusRequestChannelController
}
