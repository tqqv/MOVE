const db = require("../models/index.js");
const { createStripeAccountId, updateStripeAccount, retrieveAccountStripe, createStripeLinkVerify, createPayout, retrievePayout } = require("./stripeService.js");
const { Channel, User, WithdrawInfor, Withdraw, sequelize } = db;


const createMethodWithdraw = async(channelId, bankData) => {
  try {
    if(!bankData.bankHolderName || !bankData.bankNumber || !bankData.routingNumber){
      return {
        status: 400,
        data: null,
        message: "Bank data not null."
      }
    }

    const channel = await Channel.findOne({
      where: {
        id: channelId
      },
      include: [
        {
          model: User,
          attributes: ['email', 'fullName', 'dob']
        }
      ]
    })

    if(!channel.stripeAccountId) {
      const account = await createStripeAccountId(channel.User.email)
      channel.stripeAccountId = account
      await channel.save()
    }

    const res = await updateStripeAccount(channel.stripeAccountId, channel.User, bankData)

    const createWithdrawInfor = await WithdrawInfor.create({
      channelId: channelId,
      bankName: res.external_accounts.data[0].bank_name,
      bankHolderName: bankData.bankHolderName,
      bankNumber: res.external_accounts.data[0].last4,
      routingNumber: bankData.routingNumber,
      stripeBankId: res.external_accounts.data[0].id,
      status: res.requirements.currently_due[0] || "verified"
    })

    return {
      status: 200,
      data: createWithdrawInfor,
      message: "Successful"
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const updateVerifyAccountStripe = async(channelId) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: channelId
      }
    })

    const check = await retrieveAccountStripe(channel.stripeAccountId)

    const withdrawInfor = await WithdrawInfor.findOne({
      where: {
        channelId: channelId
      }
    })

    if(check.requirements.currently_due.length === 0) {
      withdrawInfor.status = "verified"
      await withdrawInfor.save()

      return {
        status: 200,
        data: withdrawInfor.status,
        message: "Updated successfully"
      }
    }

    return {
      status: 200,
      data: withdrawInfor.status,
      message: "Check your information."
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getLinkStripeVerify = async(channelId) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: channelId
      }
    })

    const linkUrl = await createStripeLinkVerify(channel.stripeAccountId);

    return {
      status: 200,
      data: linkUrl,
      message: "Get link verify stripe successful"
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const cashout = async(channelId, repInput) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: channelId
      },
      include: [{
        model: WithdrawInfor,
        attributes: ['stripeBankId']
      }]
    })

    if (repInput < 2500) {
      return {
        status: 400,
        data: null,
        message: 'You must input rep >= 2500',
      };
    }

    if (channel.rep < repInput) {
      return {
        status: 400,
        data: null,
        message: 'Insufficient rep in wallet',
      };
    }

    const amount = repInput * 0.005

    const payout = await createPayout(channel.stripeAccountId, channel.WithdrawInfors.stripeBankId, amount)

    const createWithdraw = await Withdraw.create({
      channelId: channelId,
      rep: repInput,
      amount: amount,
      status: payout.status === "paid" ? "completed" : payout.status,
      arrivalDate: new Date(payout.arrival_date * 1000),
      stripePayoutId: payout.id
      }
    )

    await channel.decrement('rep', { by: rep });

    // chưa xử lý trừ rep nè check nghe

    return {
      status: 200,
      data: createWithdraw,
      message: "Create withdraw successful."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const checkStatusStripePayout = async (channelId) => {
  try {
    const listPending = await Withdraw.findAll({
      where: {
        channelId: channelId,
        status: "pending",
      },
    });

    if (!listPending.length) {
      return;
    }

    for (const payout of listPending) {
      try {
        const check = await retrievePayout(payout.stripePayoutId);

        if (check.status !== "pending") {
          payout.status = check.status;
          await Withdraw.update(
            { status: payout.status },
            { where: { stripePayoutId: payout.stripePayoutId } }
          );
          if (check.status === "failed") {
            await Channel.increment(
              { rep: payout.rep },
              { where: { id: channelId } }
            );
            // Thêm logic bắn thông báo nếu cần
          }
        }
      } catch (err) {
        console.error(`Failed to process payout with ID ${payout.stripePayoutId}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`Failed to retrieve pending payouts: ${error.message}`);
  }
};


const getListCashoutHistory = async(channelId) => {
  try {
    await checkStatusStripePayout(channelId);

    const listCashout = await Withdraw.findAll({
      where: {
        channelId: channelId,
      }
    })

    return {
      status: 200,
      data: listCashout,
      message: "Get list cashout history successful."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getWithdrawInfor = async(channelId) => {
  try {
    const withdrawInfor = await WithdrawInfor.findOne({where: { channelId: channelId }})

    return {
      status: 200,
      data: withdrawInfor,
      message: "Get withdraw infor successful."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

module.exports = {
  createMethodWithdraw,
  updateVerifyAccountStripe,
  getLinkStripeVerify,
  cashout,
  getListCashoutHistory,
  getWithdrawInfor
}
