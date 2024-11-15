const express = require('express');
const { verifyUser } = require('../middlewares/verifyToken');
const { getListRepPackageController } = require('../controllers/repPackageController');
const repPackageRouter = express.Router();


repPackageRouter.get('/', getListRepPackageController)

module.exports = repPackageRouter;
