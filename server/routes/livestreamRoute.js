const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController} = require('../controllers/livestreamController');
const livestreamRouter = express.Router();


livestreamRouter.post('/', verifyStreamer, createLivestreamController)

module.exports = livestreamRouter;
