const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { test1, test2 } = require("../controllers/cashoutController");
const cashoutRoute = express.Router();


cashoutRoute.post('/createAccountId', test1);
cashoutRoute.post('/createPayout', test2);


module.exports = cashoutRoute;
