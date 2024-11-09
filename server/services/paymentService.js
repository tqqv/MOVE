const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require("../models/index.js");
const { CardPaymentInfor } = db;



const createCardInfor = async(userId, cardNumber, cardName, cardType, paymentMethodId, expirationDate, country) => {
  try {
    await CardPaymentInfor.create({
      userId: userId,
      cardNumber: cardNumber,
      cardOwnerName: cardName,
      cardType: cardType,
      paymentMethodId: paymentMethodId,
      expirationDate: expirationDate,
      country: country,
    })

    return{
      status: 200,
      message: 'Card information created successfully.'
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
    const card = await CardPaymentInfor.findOne({
      where: {
        userId: userId
      },
      attributes: ['cardOwnerName', 'cardType', 'cardNumber']
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

const createPayment = async() => {
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.CLIENT_HOST}/success`,
      cancel_url: `${process.env.CLIENT_HOST}`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data:{
              name: '100 REPS'
            },
            unit_amount: 50*2
          },
          quantity: 2,
        },
      ],
      mode: 'payment',
    });

    console.log(session.url);

    return {
      url: session.url
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

}
