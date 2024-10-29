const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createCategoryController, getCateByIdController, editCategoryController, deleteCategoryController, getAllCategoryController, getAllCategoryWithViewController, getCateByTitleController } = require("../controllers/categoryController");
const cateRouter = express.Router();


cateRouter.post('/', verifyAdmin, createCategoryController);
cateRouter.get('/', getAllCategoryController);
cateRouter.get('/getAllView', getAllCategoryWithViewController);
cateRouter.get('/getCateById/:cateId', getCateByIdController);
cateRouter.patch('/', verifyAdmin, editCategoryController);
cateRouter.delete('/:cateId', verifyAdmin, deleteCategoryController);
cateRouter.get('/getCateByTitle/:title', getCateByTitleController);

module.exports = cateRouter;
