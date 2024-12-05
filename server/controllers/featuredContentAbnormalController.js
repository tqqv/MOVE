const responseHandler = require("../middlewares/responseHandler");
const { createFeatureContentAbnormalService, getFeatureContentAbnormalService } = require("../services/featuredContentAbnormalService.js");

const getFeatureContentAbnormalController = async(req, res, next) => {
    const result = await getFeatureContentAbnormalService();
    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const createFeatureContentAbnormalController = async(req, res, next) => {
    const date = req.body.date
    const pricePerDay = req.body.pricePerDay
    const maxBookings = req.body.maxBookings
    const result = await createFeatureContentAbnormalService(date, pricePerDay, maxBookings);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}


module.exports = {
    createFeatureContentAbnormalController,
    getFeatureContentAbnormalController
}
