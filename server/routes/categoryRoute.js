const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createCategoryController, getCateByIdController, editCategoryController, deleteCategoryController, getAllCategoryController } = require("../controllers/categoryController");
const cateRouter = express.Router();


cateRouter.post('/', verifyAdmin, createCategoryController);
cateRouter.get('/', getAllCategoryController);
cateRouter.get('/getCateById/:cateId', getCateByIdController);
cateRouter.patch('/', verifyAdmin, editCategoryController);
cateRouter.delete('/:cateId', verifyAdmin, deleteCategoryController);

module.exports = cateRouter;