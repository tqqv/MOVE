const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createDonationItemController, getAllDonationItemController, editCategoryController, deleteCategoryController, getAllCategoryController, getAllCategoryWithViewController, getCateByTitleController } = require("../controllers/donationItemController");
const donationItemRouter = express.Router();


donationItemRouter.get('/', getAllDonationItemController);


module.exports = donationItemRouter;
