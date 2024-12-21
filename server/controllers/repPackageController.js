const responseHandler = require("../middlewares/responseHandler");
const { getListRepPackage, createRepPackage, editRepPackage, getRepPackageById, deleteRepPackage } = require("../services/repPackageService");

const getListRepPackageController = async (req, res, next) => {
  const result = await getListRepPackage();

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const createRepPackageController = async (req, res, next) => {
  const data = req.body
  const result = await createRepPackage(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const editRepPackageController = async (req, res, next) => {
  const data = req.body
  const repPackageId = req.params.repPackageId
  const result = await editRepPackage(repPackageId, data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getRepPackageByIdController = async (req, res, next) => {
  const repPackageId = req.params.repPackageId
  const result = await getRepPackageById(repPackageId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleteRepPackageController = async (req, res, next) => {
  const repPackageId = req.params.repPackageId
  const result = await deleteRepPackage(repPackageId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  getListRepPackageController,
  createRepPackageController,
  editRepPackageController,
  getRepPackageByIdController,
  deleteRepPackageController,
}
