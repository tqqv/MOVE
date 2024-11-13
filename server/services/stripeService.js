const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const createStripeCustomerId = async(name, email) => {
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });

    return customer.id
  } catch (error) {
    return error.message
  }
}

const createStripeSetupIntent = async(customerId) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
    });

    return setupIntent
  } catch (error) {
    return error.message
  }
}

const createStripePaymentIntent = async(customerId, paymentMethodId, amount) => {
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount*100,
      currency: 'usd',
      payment_method: paymentMethodId,
      customer: customerId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    return payment
  } catch (error) {
    return error.message
  }
}

const retrievePaymentMethod = async(paymentMethodId) => {
  try {
    const data = await stripe.paymentMethods.retrieve(paymentMethodId)

    return data
  } catch (error) {
    return error.message
  }
}

const detachPaymentMethod = async(paymentMethodId) => {
  try {
    return await stripe.paymentMethods.detach(paymentMethodId);
  } catch (error) {
    return error.message
  }
}

module.exports = {
  createStripeCustomerId,
  createStripeSetupIntent,
  retrievePaymentMethod,
  createStripePaymentIntent,
  detachPaymentMethod,
}
