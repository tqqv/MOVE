const responseHandler = require("../middlewares/responseHandler");
const { getListRepPackage } = require("../services/repPackageService");

const getListRepPackageController = async (req, res, next) => {
  const result = await getListRepPackage();

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  getListRepPackageController,
}
