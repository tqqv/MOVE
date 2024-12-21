const { Op, fn, literal, col } = require("sequelize");
const db = require("../models/index.js");
const { createStripeCustomerId, createStripeSetupIntent, retrievePaymentMethod, createStripePaymentIntent, detachPaymentMethod } = require("./stripeService.js");
const { PaymentCardInfor, User, RepPackage, Payment, sequelize } = db;

const createSetupIntent = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId }
    });

    if (!user.stripeCustomerId) {
      user.stripeCustomerId  = await createStripeCustomerId(user.username, user.email);
      await user.save();
    }

    // Tạo SetupIntent với customerId của user
    const setupIntent = await createStripeSetupIntent(user.stripeCustomerId)

    return {
      status: 200,
      data: setupIntent.client_secret,
      message: "Setup intent created successfully"
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message
    };
  }
};

const createCardInfor = async(userId, cardName, paymentMethodId, country) => {
  try {
    if(!cardName || !paymentMethodId || !country){
      return{
        status: 400,
        message: 'Not null.'
      }
    }

    const user = await User.findOne({
      where: {
        id: userId
      }
    })

    const paymentMethod = await retrievePaymentMethod(paymentMethodId)

    if(paymentMethod.customer === user.stripeCustomerId){
      await PaymentCardInfor.create({
        userId: userId,
        cardNumber: paymentMethod.card.last4,
        cardOwnerName: cardName,
        cardType: paymentMethod.card.brand,
        paymentMethodId: paymentMethodId,
        expirationDate: paymentMethod.card.exp_month + "/" + paymentMethod.card.exp_year,
        country: country,
      })

      return{
        status: 200,
        message: 'Card information created successfully.'
      }
    }else {
      return{
        status: 400,
        message: 'This card no attach to customer Stripe of user'
      }
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const getCardInfoByUserId = async(userId) => {
  try {
    const card = await PaymentCardInfor.findOne({
      where: {
        userId: userId
      },
      attributes: ['cardOwnerName', 'cardType', 'cardNumber', 'paymentMethodId']
    })

    if(!card) {
      return {
        status: 404,
        data: null,
        message: "The user does not have a card yet"
      }
    }

    return{
      status: 200,
      data: card,
      message: 'Get card successfully.'
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const createPayment = async(userId, paymentMethodId, repPackageId) => {
  try {
    if(!paymentMethodId && !repPackageId) {
      return {
        status: 404,
        message: "Not null"
      }
    }

    const user = await User.findOne({
      where: {
        id: userId
      }
    })

    const repPackage = await RepPackage.findOne({
      where: {
        id: repPackageId
      }
    })

    if (!user.stripeCustomerId) {
      user.stripeCustomerId  = await createStripeCustomerId(user.username, user.email);
      await user.save();
    }

    const totalAmount = (repPackage.amount-(repPackage.amount*repPackage.discount)).toFixed(2)

    const paymentIntent = await createStripePaymentIntent(user.stripeCustomerId, paymentMethodId, totalAmount)

    if (paymentIntent.status === 'succeeded') {
      await Payment.create({
        userId: userId,
        repPackageId: repPackageId,
        paymentMethodId: paymentMethodId,
        paymentIntentId: paymentIntent.id,
        paymentStatus: "completed",
        amount: totalAmount,
        rep: repPackage.rep,
      })

      user.REPs += repPackage.rep;
      await user.save();

      return {
        status: 200,
        message: 'Payment successfully.'
      }
    } else {
      return {
        status: 400,
        message: `Please use this PaymentMethod with the Customer that it belongs to instead`
      }
    }

  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const deleteCardInfo = async(userId, paymentMethodId) => {
  try {
    await detachPaymentMethod(paymentMethodId)

    await PaymentCardInfor.destroy({
      where: {
        userId: userId,
        paymentMethodId: paymentMethodId
      }
    })

    return {
      status: 200,
      message: "Card removed successfully"
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const getPaymentHistory = async(userId, page, pageSize, startDate, endDate) => {
  try {
    const whereCondition = { userId };

    if (startDate && endDate) {
      if (!endDate.includes(' ') && !startDate.includes(' ')) {
        endDate = `${endDate} 23:59:59`;
        startDate = `${startDate} 00:00:00`;
      }
      whereCondition.createdAt = {
          [Op.between]: [startDate, endDate]
      };
    }

    const list = await Payment.findAll({
        where: whereCondition,
        attributes: [
            'repPackageId',
            'rep',
            [fn('DATE', col('createdAt')), 'created_date'],
            [fn('COUNT', '*'), 'count']
        ],
        group: ['repPackageId', literal('DATE(createdAt)'), 'rep'],
        order: [['created_date', 'DESC']],
        offset: (page - 1) * pageSize *1,
        limit: pageSize*1
    });

    const count = await Payment.count({
      where: whereCondition,
        attributes: [
            'repPackageId',
            'rep',
            [fn('COUNT', '*'), 'count']
        ],
        group: ['repPackageId', literal('DATE(createdAt)'), 'rep'],
    })

    return {
      status: 200,
      data: {
        list,
        count: count.length,
        totalPages: Math.ceil(count.length/pageSize)
      },
      message: "Get list payment history successfully"
    }
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

module.exports = {
  createPayment,
  getCardInfoByUserId,
  createCardInfor,
  createSetupIntent,
  deleteCardInfo,
  getPaymentHistory
}
