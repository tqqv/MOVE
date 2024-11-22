const responseHandler = require("../middlewares/responseHandler");
const { createStripeAccountId, createPayout } = require("../services/stripeService");

const test1 = async (req, res, next) => {
  const result = await createStripeAccountId();
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const test2 = async (req, res, next) => {
  const accountId = req.body.accountId;
  const result = await createPayout(accountId);
  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  test1,
  test2,
}
