const db = require("../models/index.js");
const { createStripeAccountId, updateStripeAccount, retrieveAccountStripe, createStripeLinkVerify, createPayout, retrievePayout, deleteWithdrawMethod } = require("./stripeService.js");
const { Channel, User, WithdrawInfor, Withdraw, sequelize } = db;


const createMethodWithdraw = async(channelId, bankData) => {
  const bankNumberRegex = /^\d{9,16}$/;
  const routingNumberRegex = /^\d{4}-\d{3}$/;
  try {
    if(!bankData.bankHolderName || !bankData.bankNumber || !bankData.routingNumber){
      return {
        status: 400,
        data: null,
        message: "Bank data not null."
      }
    }

    // Validate Bank Singapore
    if (!bankNumberRegex.test(bankData.bankNumber)) {
      return {
        status: 400,
        data: null,
        message: "Bank number must be 9-16 digits."
      }
    }

    if (!routingNumberRegex.test(bankData.routingNumber)) {
      return {
        status: 400,
        data: null,
        message: "Routing number must be in the format XXXX-XXX."
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

    await channel.decrement('rep', { by: repInput });

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

    const channel = await Channel.findOne({where: {id: channelId}})

    for (const payout of listPending) {
      try {
        const check = await retrievePayout(payout.stripePayoutId, channel.stripeAccountId);

        if (check.status !== "pending") {
          await Withdraw.update(
            { status: check.status === "paid" ? "completed" : check.status },
            { where: { stripePayoutId: payout.stripePayoutId } }
          );
          if (check.status === "failed") {
            await Channel.increment(
              { rep: payout.rep },
              { where: { id: channelId } }
            );
          }
        }
      } catch (err) {
        console.error(`Loi pay out Id ${payout.stripePayoutId}: ${err.message}`);
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

const deleteWithdrawInfor = async(channelId, stripeBankId) => {
  try {
    const channel = await Channel.findOne({where: { id: channelId }})

    await deleteWithdrawMethod(channel.stripeAccountId, stripeBankId)

    await WithdrawInfor.destroy({
      where: {
        channelId: channelId,
        stripeBankId: stripeBankId
      }
    })

    return {
      status: 200,
      message: "Bank removed successfully"
    }

  } catch (error) {
    return {
      status: 500,
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
  getWithdrawInfor,
  deleteWithdrawInfor
}
