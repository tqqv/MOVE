const responseHandler = require("../middlewares/responseHandler");
const { createCategory, getAllCategory, getCateById, editCategory, deleteCategory, getAllCategoryWithView, getCateByTitle, getAllCategoryAdmin } = require("../services/categoryService");


const createCategoryController = async (req, res, next) => {
  const data = req.body;
  const result = await createCategory(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllCategoryController = async(req, res, next) => {
  const result = await getAllCategory()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getCateByIdController = async(req, res, next) => {
  const cateId = req.params.cateId
  const result = await getCateById(cateId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const editCategoryController = async (req, res, next) => {
  const { cateId } = req.params;
  const data = req.body;
  const result = await editCategory(cateId, data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleteCategoryController = async (req, res, next) => {
  const cateId = req.params.cateId
  const result = await deleteCategory(cateId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllCategoryWithViewController = async(req, res, next) => {
  const result = await getAllCategoryWithView()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getCateByTitleController = async(req, res, next) => {
  const title = req.params.title
  const result = await getCateByTitle(title)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllCategoryAdminController = async(req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 100;
  const result = await getAllCategoryAdmin(page, pageSize)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createCategoryController,
  getAllCategoryController,
  getCateByIdController,
  editCategoryController,
  deleteCategoryController,
  getAllCategoryWithViewController,
  getCateByTitleController,
  getAllCategoryAdminController,
}
