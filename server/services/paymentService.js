const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require("../models/index.js");
const { CardPaymentInfor, User } = db;

const createStripeCustomerId = async(name, email) => {
  try {
    const customer = await stripe.customers.create({
      name: name,  // Tên người dùng
      email: email, // Email của người dùng
    });

    return customer.id
  } catch (error) {
    return error.message
  }
}

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
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
    });

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
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    await CardPaymentInfor.create({
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

const deleteCardInfo = async(userId, paymentMethodId) => {
  try {
    await stripe.paymentMethods.detach(paymentMethodId);

    await CardPaymentInfor.destroy({
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

module.exports = {
  createPayment,
  getCardInfoByUserId,
  createCardInfor,
  createSetupIntent,
  deleteCardInfo,
}
