/**
 * Generic success response handler
 * @param {*} data - response that needs to be returned as part of API result
 */
module.exports = (status, data, message) => (req, res, next) => {
  const response = {
    success: status === 200 ? true : false,
  };

  if (data) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  res.status(status).json(response);
};
