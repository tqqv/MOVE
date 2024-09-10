const express = require("express");
var dotenv = require("dotenv");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const { connection } = require("./config/connectDB");
const authRouter = require("./routes/authRoute.js");

const passport = require('passport');
const { googleLogin } = require("./controllers/authController.js");
require('./utils/google/passport');

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World from the backend!");
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback',
    passport.authenticate('google',
    { successRedirect: process.env.CLIENT_HOST, failureRedirect: '/login', failureMessage: true },
    googleLogin
  )
)

app.use("/api/auth", authRouter);

// connect DB
connection();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
