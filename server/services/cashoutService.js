const { Op } = require("sequelize");
const db = require("../models/index.js");
const { createStripeAccountId, updateStripeAccount, retrieveAccountStripe, createStripeLinkVerify, createPayout, retrievePayout, deleteWithdrawMethod, createNewBankAccount } = require("./stripeService.js");
const { Channel, User, WithdrawInfor, Withdraw, sequelize } = db;


const createMethodWithdraw = async(channelId, bankToken) => {
  try {

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

      const res = await updateStripeAccount(channel.stripeAccountId, channel.User, bankToken)

      const createWithdrawInfor = await WithdrawInfor.create({
        channelId: channelId,
        bankName: res.external_accounts.data[0].bank_name,
        bankHolderName: res.external_accounts.data[0].account_holder_name,
        bankNumber: res.external_accounts.data[0].last4,
        routingNumber: res.external_accounts.data[0].routing_number,
        stripeBankId: res.external_accounts.data[0].id,
        status: res.requirements.currently_due[0] || "verified"
      })

      return {
        status: 200,
        data: createWithdrawInfor,
        message: "Successful"
      }
    } else {
      const res = await createNewBankAccount(channel.stripeAccountId, bankToken)

      const createWithdrawInfor = await WithdrawInfor.create({
        channelId: channelId,
        bankName: res.bank_name,
        bankHolderName: res.account_holder_name,
        bankNumber: res.last4,
        routingNumber: res.routing_number,
        stripeBankId: res.id,
        status: "verified"
      })

      // await detachBankAccount(channelId, channel.stripeAccountId)
      return {
        status: 200,
        data: createWithdrawInfor,
        message: "Successful"
      }
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
        attributes: ['stripeBankId', 'bankName', 'bankHolderName', 'bankNumber'],
        where: {
          status: 'verified'
        }
      }]
    })

    if (!channel.WithdrawInfors) {
      return {
        status: 400,
        data: null,
        message: 'Insert your bank account',
      };
    }
console.log(repInput);

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

    const amount = Math.round(repInput * 0.005)


    const payout = await createPayout(channel.stripeAccountId, channel.WithdrawInfors.stripeBankId, amount)
console.log(repInput);

    const createWithdraw = await Withdraw.create({
      channelId: channelId,
      rep: repInput,
      amount: amount,
      status: payout.status === "paid" ? "completed" : payout.status,
      arrivalDate: new Date(payout.arrival_date * 1000),
      stripePayoutId: payout.id,
      bankName: channel.WithdrawInfors.bankName,
      bankHolderName: channel.WithdrawInfors.bankHolderName,
      bankNumber: channel.WithdrawInfors.bankNumber
      }
    )

    await Channel.decrement('rep', { 
      by: repInput,
      where: {
        id: channelId
      }
    });

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


const getListCashoutHistory = async(channelId, page, pageSize, startDate, endDate, sortCondition) => {
  try {
    await checkStatusStripePayout(channelId);

    const whereCondition = { channelId };

    if (startDate && endDate) {
      if (!endDate.includes(' ') && !startDate.includes(' ')) {
        endDate = `${endDate} 23:59:59`;
        startDate = `${startDate} 00:00:00`;
      }
      whereCondition.createdAt = {
          [Op.between]: [startDate, endDate]
      };
    }

    const listCashout = await Withdraw.findAndCountAll({
      where: whereCondition,
      order: [[sortCondition.sortBy, sortCondition.order]],
      offset: (page - 1) * pageSize *1,
      limit: pageSize*1
    })

    return {
      status: 200,
      data: {
        listCashout,
        totalPages: Math.ceil(listCashout.count/pageSize)
      },
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
    const withdrawInfor = await WithdrawInfor.findOne({where: { channelId: channelId, status: { [Op.ne]: 'deleted'} }})

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

const detachBankAccount = async (channelId, accountId) => {
  try {
    const listDelete = await WithdrawInfor.findAll({
      where: { channelId: channelId, status: 'deleted' },
    });

    if (!listDelete.length) {
      console.log('No records with status "deleted" found.');
      return;
    }

    for (const withdrawInfor of listDelete) {
      try {

        await deleteWithdrawMethod(accountId, withdrawInfor.stripeBankId);
        console.log(`Successfully deleted withdraw method: ${withdrawInfor.stripeBankId}`);

        await WithdrawInfor.destroy({
          where: {
            channelId: channelId,
            status: 'deleted',
            stripeBankId: withdrawInfor.stripeBankId,
          },
        });

      } catch (err) {
        console.error(`Error processing stripeBankId ${withdrawInfor.stripeBankId}: ${err.message}`);
      }
    }

    console.log('All deletions processed successfully.');
  } catch (error) {
    console.error('Error in detachBankAccount:', error.message);
  }
};


const deleteWithdrawInfor = async(channelId, stripeBankId) => {
  try {
    const [updatedRows] = await WithdrawInfor.update(
      { status: 'deleted' },
      {
        where: {
          channelId: channelId,
          stripeBankId: stripeBankId,
        },
      }
    );

    if (updatedRows === 0) {
      return {
        status: 404,
        message: "No records were removed."
      }
    } else {
      return {
        status: 200,
        message: "Bank removed successfully"
      }
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
