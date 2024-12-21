const express = require("express");
const { searchCategoriesController, searchUserController, searchVideoController } = require("../controllers/searchController");
const searchRouter = express.Router();

searchRouter.get('/totalCate', searchCategoriesController);
searchRouter.get('/totalUser', searchUserController);
searchRouter.get('/totalVideo', searchVideoController);


module.exports = searchRouter