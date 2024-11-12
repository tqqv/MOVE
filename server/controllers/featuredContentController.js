const responseHandler = require("../middlewares/responseHandler");
const { createFeatureContentService, getAllFeatureContentService } = require("../services/featuredContentService");

const getAllFeatureContentController = async(req, res, next) => {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const result = await getAllFeatureContentService(page, pageSize);
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


module.exports = {
    createFeatureContentController,
    getAllFeatureContentController
}
