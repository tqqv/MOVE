const responseHandler = require("../middlewares/responseHandler");
const { createDonationItem ,getAllDonationItem} = require("../services/donationItemService");


const createDonationItemController = async (req, res, next) => {
  const data = req.body;
  const result = await createDonationItem(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllDonationItemController = async(req, res, next) => {
  const result = await getAllDonationItem()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
  createDonationItemController,getAllDonationItemController
}
