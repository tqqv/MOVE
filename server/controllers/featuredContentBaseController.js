const responseHandler = require("../middlewares/responseHandler");
const { createFeatureContentBaseService, getFeatureContentBaseService } = require("../services/featuredContentBaseService.js");

const getFeatureContentBaseController = async(req, res, next) => {
    const result = await getFeatureContentBaseService();
    responseHandler(result.status, result.data, result.message)(req, res, next);
}


const createFeatureContentBaseController = async(req, res, next) => {

    const pricePerDay = req.body.pricePerDay
    const maxBookings = req.body.maxBookings
    const result = await createFeatureContentBaseService(pricePerDay, maxBookings);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
    createFeatureContentBaseController,
    getFeatureContentBaseController
}
