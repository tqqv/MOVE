const { Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { avgRates } = require("../utils/redis/key/streamKey.js");
const { updateStreamStats, reRankingTopDonators } = require("../utils/redis/stream/redisStreamService.js");
const { createNotification } = require("./notificationService.js");
const { Donation, Livestream, DonationItem, Channel, User } = db;

const donateLivestream = async (userId, donatorChannelId, livestreamId, donationItemId, content) => {
  try {
    if (!livestreamId || !donationItemId) {
      return {
        status: 400,
        message: "Not null.",
      };
    }

    const [livestream, donationItem] = await Promise.all([
      Livestream.findOne({
        where: {
          id: livestreamId,
          isLive: true,
        },
      }),
      DonationItem.findOne({
        where: {
          id: donationItemId,
        },
      }),

    ]);
    let donatorChannel;
    if(donatorChannelId) {
      donatorChannel = await Channel.findOne({
        where: {
          id: donatorChannelId,
        },
      })
    }

    let user = await User.findOne({
      where: {
        id: userId || donatorChannel.userId,
      },
    })

    if (!livestream) {
      return {
        status: 404,
        message: "Livestream is off or does not exist.",
      };
    }

    if (!donationItem) {
      return {
        status: 404,
        message: "The gift you chose does not exist.",
      };
    }

    if(user.REPs === 0 || user.REPs < donationItem.REPs) {
      return {
        status: 400,
        message: "You don't have enough REP to donate",
      }
    }

    const channel = await Channel.findOne({
      where: {
        id: livestream.streamerId,
      },
    });

    const [donation] = await Promise.all([
      Donation.create({
        userId,
        donatorChannelId,
        livestreamId,
        donationItemId,
        content,
        REPs: donationItem.REPs,
      }),
      User.decrement('REPs', {
        by: donationItem.REPs,
        where: { id: userId } // Điều kiện giảm REPs cho đúng user
      }),
      Channel.increment('rep', {
        by: donationItem.REPs,
        where: { id: channel.id } // Điều kiện tăng rep cho đúng channel
      }),
    ]);

    const totalDonate = await Donation.findAll({
      where: {
          userId: userId,
          livestreamId: livestreamId
      },
      attributes: [
          [Sequelize.fn('SUM', Sequelize.col('REPs')), 'totalDonation']
      ],
      raw: true
    });

    const totalDonateValue = totalDonate[0]?.totalDonation || 0;

    updateStreamStats(livestream.streamerId, "increment", "totalReps", donationItem.REPs),
    reRankingTopDonators(
      livestream.streamerId,
      {
        donatorName: donatorChannel ? donatorChannel.channelName : user.username,
        donatorId: donatorChannel ? donatorChannel.id : user.id,
        donatorAvatar: donatorChannel ? donatorChannel.avatar : user.avatar,
        username: user.username,
        isChannel: donatorChannel ? true : false
      },
      totalDonateValue
    )

    await createNotification(
      "rep",
      "recieve",
      (donatorChannelId ? null : user.id),
      donatorChannelId,
      livestream.streamerId,
      null,
      null,
      livestreamId,
      donationItemId
    );

    return {
      status: 200,
      data: donation,
      message: "Donation successfully created.",
    };
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      message: error.message,
    };
  }
};

const getDonateByLivestreamId = async(channelId, livestreamId) => {
  try {
    const livestream = await Livestream.findOne({
      streamerId: channelId,
      id: livestreamId
    });

    if (!livestream) {
      return {
        status: 404,
        message: "Livestream is not exist or you are not allowed to livestream.",
      };
    }

    const listDonation = await Donation.findAll({
      where: {
        livestreamId: livestreamId
      }
    })

    return {
      status: 200,
      data: listDonation,
      message: "Get list donation of livestream successful.",
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
}

module.exports = {
  donateLivestream,
  getDonateByLivestreamId
}
