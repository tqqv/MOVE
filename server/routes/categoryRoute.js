const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createCategoryController, getCateByIdController, editCategoryController, deleteCategoryController, getAllCategoryController } = require("../controllers/categoryController");
const cateRouter = express.Router();


cateRouter.post('/create', verifyAdmin, createCategoryController);
cateRouter.get('/getAllCate', getAllCategoryController);
cateRouter.get('/getCateById/:cateId', getCateByIdController);
cateRouter.patch('/edit', verifyAdmin, editCategoryController);
cateRouter.delete('/delete/:cateId', verifyAdmin, deleteCategoryController);

module.exports = cateRouter;
