const db = require("../models/index.js");
const { Report, ReportType, User, Video, Livestream, Comment, Channel } = db;

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

    const checkReport = await Report.findOne({
      where: {
        targetVideoId: videoId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this video"
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

    const checkReport = await Report.findOne({
      where: {
        targetLivestreamId: livestreamId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this livestream"
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

    const checkReport = await Report.findOne({
      where: {
        targetCommentId: commentId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this comment"
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

const reportChatMessages = async(userId, content, reportTypeId, accountId) => {
  try {
    if (!userId || !content || !reportTypeId  || !accountId) {
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
      targetAccountId: accountId,
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

const reportChannel = async(userId, channelId, reportTypeId) => {
  try {
    if (!userId || !channelId || !reportTypeId) {
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

    const checkChannel = await Channel.findOne({
      where: {
        id: channelId
      }
    })

    if(!checkChannel) {
      return {
        status: 404,
        data: null,
        message: "Channel not found"
      }
    }

    const checkReport = await Report.findOne({
      where: {
        targetChannelId: channelId,
        reporterId: userId
      }
    })

    if(checkReport){
      return {
        status: 200,
        data: null,
        message: "You reported this channel"
      }
    }

    const newReport = await Report.create({
      reporterId: userId,
      targetChannelId: channelId,
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

module.exports = {
  reportVideo,
  reportLivestream,
  reportComment,
  reportChatMessages,
  getListReportByType,
  reportChannel,
}
