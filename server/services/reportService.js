const db = require("../models/index.js");
const { Report, ReportType, User, Video, Livestream, Comment } = db;

const reportVideo = async(userId, videoId, reportTypeId) => {
  try {
    if (!userId || !videoId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkVideo = await Video.findOne({
      where: {
        id: videoId
      }
    })

    if(!checkVideo) {
      return {
        status: 404,
        data: null,
        message: "Video not found"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetVideoId: videoId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportLivestream = async(userId, livestreamId, reportTypeId) => {
  try {
    if (!userId || !livestreamId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkLivestream = await Livestream.findOne({
      where: {
        id: livestreamId
      }
    })

    if(!checkLivestream) {
      return {
        status: 404,
        data: null,
        message: "Livestream not found"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetLivestreamId: livestreamId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportComment = async(userId, commentId, reportTypeId) => {
  try {
    if (!userId || !commentId || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const checkComment = await Comment.findOne({
      where: {
        id: commentId
      }
    })

    if(!checkComment) {
      return {
        status: 404,
        data: null,
        message: "Comment not found"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetCommentId: commentId,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const reportChatMessages = async(userId, content, reportTypeId) => {
  try {
    if (!userId || !content || !reportTypeId) {
      return {
        status: 400,
        data: null,
        message: "Not null"
      }
    }

    const checkUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if(!checkUser) {
      return {
        status: 404,
        data: null,
        message: "User not found"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      chatMessagesContent: content,
      reportTypeId: reportTypeId
    })

    return {
      status: 200,
      data: newReport,
      message: "Report has been created successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

const getListReportByType = async(type) => {
  try {
    const listReport = await ReportType.findAll({
      where: {
        type: type
      }
    })

    return {
      status: 200,
      data: listReport,
      message: `Get list report ${type} successfully.`
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error
    }
  }
}

module.exports = {
  reportVideo,
  reportLivestream,
  reportComment,
  reportChatMessages,
  getListReportByType
}
