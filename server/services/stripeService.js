const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path');


const createStripeCustomerId = async(name, email) => {
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });

    return customer.id
  } catch (error) {
    throw new Error(error.message)
  }
}

const createStripeSetupIntent = async(customerId) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
    });

    return setupIntent
  } catch (error) {
    throw new Error(error.message)
  }
}

const createStripePaymentIntent = async(customerId, paymentMethodId, amount) => {
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount*100,
      currency: 'sgd',
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
    throw new Error(error.message)
  }
}

const retrievePaymentMethod = async(paymentMethodId) => {
  try {
    const data = await stripe.paymentMethods.retrieve(paymentMethodId)

    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

const detachPaymentMethod = async(paymentMethodId) => {
  try {
    return await stripe.paymentMethods.detach(paymentMethodId);
  } catch (error) {
    throw new Error(error.message)
  }
}

const createStripeAccountId = async(email) => {
  try {
    const account = await stripe.accounts.create({
      type: 'custom',
      country: 'SG',
      email: email,
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true},
      }
    });

    return account.id
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateStripeAccount = async(accountId, channelData, bankData) => {
  try {
    let firstName
    let lastName
    let day
    let month
    let year
    const nameParts = channelData.fullName.trim().split(" ");

    if (nameParts.length > 1) {
      firstName = nameParts[0];
      lastName = nameParts[nameParts.length - 1];
    } else {
      firstName = nameParts[0];
      lastName = "";
    }

    const dateParts = channelData.dob.split("-");
    year = dateParts[0];
    month = dateParts[1];
    day = dateParts[2];

    const file1 = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: fs.readFileSync(path.join(process.cwd(), 'utils/test.jpg')), // Sử dụng đường dẫn tuyệt đối
        name: 'test.jpg',
        type: 'application/octet-stream',
      },
    });

    const file2 = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: fs.readFileSync(path.join(process.cwd(), 'utils/test.jpg')), // Sử dụng đường dẫn tuyệt đối
        name: 'test.jpg',
        type: 'application/octet-stream',
      },
    });

    const account = await stripe.accounts.update(accountId, {
      business_profile: {
        mcc: '5734', // Merchant Category Code (ví dụ: "5734" cho cửa hàng máy tính)
        url: 'https://training-move-capstone.madlab.tech/', // URL của doanh nghiệp
      },
      business_type: 'individual', // Hoặc "company"
      external_account: {
        object: "bank_account",
        country: "SG",
        currency: "sgd",
        account_holder_name: bankData.bankHolderName,
        routing_number: bankData.routingNumber, // Routing number giả cho test
        account_number: bankData.bankNumber, // Account number giả cho test
      },
      individual: {
        address: {
          line1: '123 Main Street',
          line2: 'District 1',
          city: "Singapore",
          postal_code: '94111',
        },
        dob: {
          day: day,
          month: month,
          year: year,
        },
        full_name_aliases: [channelData.fullName],
        email: channelData.email,
        first_name: firstName,
        last_name: lastName,
        nationality: 'US',
        phone: '+15555555555',
        id_number: 'F1234567N', // Số ID (SSN hoặc tương tự)
        verification: {
          additional_document: {
            front: file1.id,
          },
          document: {
            front: file2.id, // Thay bằng file ID thực tế
          },
        },
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '192.168.1.1',
      },
    });

    return account
  } catch (error) {
    throw new Error(error.message)
  }
}


const createPayout = async(accountId, stripeBankId, amount) => {
  try {
    await stripe.transfers.create({
      amount: amount*100,
      currency: 'sgd',
      destination: accountId,
      transfer_group: 'ORDER_19',
    });

    const payout = await stripe.payouts.create({
      amount: amount*100,
      currency: 'sgd',
      destination: stripeBankId
    }, {
      stripeAccount: accountId
    });

    return payout
  } catch (error) {
    throw new Error(error.message)
  }
}

// const createBankToken = async() => {
//   try {
//     const bankToken = await stripe.tokens.create({
//       bank_account: {
//         country: 'US',
//         currency: 'usd',
//         routing_number: '110000000',
//         account_number: '000123456789',
//         account_holder_name: 'Linh Ne',
//         account_holder_type: 'individual'
//       }
//     });
//     console.log('Payout created:', bankToken);
//     // return payout;
//     return {
//       status: 200,
//       data: bankToken.id,
//       message: "Successful"
//     }
//   } catch (error) {
//     console.error('Error creating payout:', error);
//     // throw error;
//     return {
//       status: 500,
//       data: null,
//       message: error.message
//     }
//   }
// }

const createStripeLinkVerify = async(accountId) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://training-move-capstone.madlab.tech/reauth",
      return_url: "https://training-move-capstone.madlab.tech/dashboard-streamer/cashout?verify=success",
      type: "account_onboarding",
    });

    return accountLink.url
  } catch (error) {
    throw new Error(error.message)
  }
}

const retrieveAccountStripe = async(accountId) => {
  try {
    const account = await stripe.accounts.retrieve(accountId);

    return account
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteStripeAccountId = async(accountId) => {
  try {
    // return await stripe.accounts.deleteExternalAccount(
    //   accountId,
    //   stripeBankId
    // );
    // const account = await stripe.accounts.retrieve(accountId);

    // return {
    //   status: 200,
    //   data: account,
    //   message: "success"
    // }

    // return await stripe.account.del(accountId)
    const account = await stripe.payouts.retrieve(
      accountId,
      { stripeAccount: "acct_1QP5gA4P7oYbiP6k" }
    );
    return {
      status: 200,
      data: account,
      message: "success"
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const retrievePayout = async(payoutId, stripeAccountId) => {
  // console.log(stripeAccountId);

  return await stripe.payouts.retrieve(payoutId, { stripeAccount: stripeAccountId });
}


module.exports = {
  createStripeCustomerId,
  createStripeSetupIntent,
  retrievePaymentMethod,
  createStripePaymentIntent,
  detachPaymentMethod,
  createStripeAccountId,
  createPayout,
  // attachBankAccountToConnectedAccount,
  // createBankToken,
  deleteStripeAccountId,
  updateStripeAccount,
  createStripeLinkVerify,
  retrieveAccountStripe,
  retrievePayout
}
