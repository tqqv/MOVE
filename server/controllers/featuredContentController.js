const responseHandler = require("../middlewares/responseHandler");
const { createFeatureContentService, getAllFeatureContentService, createBookingFeatureContentService, getBookingFeatureContentService, cancelBookingFeaturedContentService, getBookDateDetailService } = require("../services/featuredContentService");

const getAllFeatureContentController = async(req, res, next) => {
    const datetime = req.query.datetime;
    const result = await getAllFeatureContentService(datetime);
    responseHandler(result.status, result.data, result.message)(req, res, next);
}


const createFeatureContentController = async(req, res, next) => {

    const livestreamId = req.body.livestreamId
    const videoId = req.body.videoId
    const startAt = req.body.startAt
    const expireAt = req.body.expireAt
    const result = await createFeatureContentService(livestreamId, videoId, startAt, expireAt);

    responseHandler(result.status, result.data, result.message)(req, res, next);
}


const createBookingFeatureContentController = async(req, res, next) => {

    const channelId = req.user.channelId
    const pickedDates  = req.body.pickedDates
    const result = await createBookingFeatureContentService(pickedDates, channelId);
    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const cancelBookingFeatureContentController = async(req, res, next) => {

    const channelId = req.user.channelId
    const pickedDates  = req.body.pickedDates
    const result = await cancelBookingFeaturedContentService(pickedDates, channelId);
    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getBookingFeatureContentController = async(req, res, next) => {

    const channelId = req.user.channelId
    const { startDate, endDate } = req.query
    const result = await getBookingFeatureContentService(startDate, endDate, channelId);
    responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getBookDateDetailController = async(req, res, next) => {
    const datetime  = req.query.datetime
    const result = await getBookDateDetailService(datetime);
    responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
    createFeatureContentController,
    getAllFeatureContentController,
    createBookingFeatureContentController,
    getBookingFeatureContentController,
    getBookDateDetailController,
    cancelBookingFeatureContentController
}
