const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createCategoryController, getCateByIdController, editCategoryController, deleteCategoryController, getAllCategoryController, getAllCategoryWithViewController, getCateByTitleController, getAllCategoryAdminController } = require("../controllers/categoryController");
const cateRouter = express.Router();

cateRouter.get('/getAllCateAdmin', verifyAdmin, getAllCategoryAdminController);
cateRouter.post('/', verifyAdmin, createCategoryController);
cateRouter.get('/getAllView', getAllCategoryWithViewController);
cateRouter.get('/getCateById/:cateId', getCateByIdController);
cateRouter.patch('/:cateId', verifyAdmin, editCategoryController);
cateRouter.delete('/:cateId', verifyAdmin, deleteCategoryController);
cateRouter.get('/getCateByTitle/:title', getCateByTitleController);
cateRouter.get('/', getAllCategoryController);

module.exports = cateRouter;
