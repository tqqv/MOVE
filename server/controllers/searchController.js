const responseHandler = require("../middlewares/responseHandler");
const { searchCategories, searchUser, searchVideo } = require("../services/searchService");

const searchCategoriesController = async (req, res, next) => {
  const data = req.query.data;
  const page = parseInt(req.query.page) || 1;  
  const pageSize = parseInt(req.query.pageSize) || 5;

  const result = await searchCategories(data, page, pageSize);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};


const searchUserController = async (req, res, next) => {
  const data = req.query.data;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 8;

  const result = await searchUser(data, page, pageSize);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};


const searchVideoController = async (req, res, next) => {
  const data = req.query.data;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 8;

  const result = await searchVideo(data, page, pageSize);
  responseHandler(result.status, result.data, result.message)(req, res, next);
};
  module.exports = {
    searchCategoriesController, searchUserController, searchVideoController
  }