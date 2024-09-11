const express = require("express");
var dotenv = require("dotenv");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const { connection } = require("./config/connectDB");
const authRouter = require("./routes/authRoute.js");
const channelRouter = require("./routes/channelRoute.js");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: process.env.CLIENT_HOST,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World from the backend!");
});

app.use("/api/auth", authRouter);
app.use("/api/channel", channelRouter);

// connect DB
connection();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
