const responseHandler = require("../middlewares/responseHandler");
const { createDonationItem ,getAllDonationItem, editDonationItem, getDonationItemById, deleteDonationItem} = require("../services/donationItemService");


const createDonationItemController = async (req, res, next) => {
  const data = req.body;
  const result = await createDonationItem(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllDonationItemController = async(req, res, next) => {
  const result = await getAllDonationItem()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const editDonationItemController = async (req, res, next) => {
  const data = req.body
  const donationItemId = req.params.donationItemId
  const result = await editDonationItem(donationItemId, data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getDonationItemByIdController = async (req, res, next) => {
  const donationItemId = req.params.donationItemId
  const result = await getDonationItemById(donationItemId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleteDonationItemController = async (req, res, next) => {
  const donationItemId = req.params.donationItemId
  const result = await deleteDonationItem(donationItemId);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createDonationItemController,
  getAllDonationItemController,
  editDonationItemController,
  getDonationItemByIdController,
  deleteDonationItemController
}
