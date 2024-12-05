const express = require("express");
var dotenv = require("dotenv");
dotenv.config();
var cors = require("cors");
var cookieParser = require("cookie-parser");
const { connection } = require("./config/connectDB");
const authRouter = require("./routes/authRoute.js");
const channelRouter = require("./routes/channelRoute.js");
const videoRouter = require("./routes/videoRoute.js");
const commentRouter = require("./routes/commentRoute.js");
const userRouter = require("./routes/userRoute.js");
const cateRouter = require("./routes/categoryRoute.js");
const lvWorkoutRouter = require("./routes/levelWorkoutRoute.js");
const ratingRouter = require("./routes/ratingRoute.js");
const {connectSocket} = require("./services/socketService.js");
const reportRouter = require("./routes/reportRoute.js");
const livestreamRouter = require("./routes/livestreamRoute.js");
const paymentRouter = require("./routes/paymentRoute.js");
const repPackageRouter = require("./routes/repPackageRoute.js");
const featuredContentRouter = require("./routes/featuredContentRoute.js");
const searchRouter = require("./routes/searchRoute.js");
const donationItemRouter = require("./routes/donationItemRoute.js");
const donationRouter = require("./routes/donationRoute.js");
const cashoutRoute = require("./routes/cashoutRoute.js");
const categoryFollowRoute = require("./routes/categoryFollowRoute.js");
const adminRoute = require("./routes/adminRoute.js");

const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: [process.env.CLIENT_HOST, process.env.ADMIN_HOST],
  credentials: true,
};
app.use(cors(corsOptions));
let server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_HOST,  // Allow requests from frontend
    methods: ["GET", "POST"],
  }
});
// Gán io vào biến toàn cục
global._io = io;
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World from the backend!");
});

app.use("/api/auth", authRouter);
app.use("/api/channel", channelRouter);
app.use("/api/video", videoRouter);
app.use("/api/comment", commentRouter);
app.use("/api/user", userRouter);
app.use("/api/category", cateRouter);
app.use("/api/levelWorkout", lvWorkoutRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/livestream", livestreamRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/report", reportRouter);
app.use("/api/repPackage", repPackageRouter);
app.use("/api/cashout", cashoutRoute);
app.use("/api/categoryFollow", categoryFollowRoute);
app.use("/api/featuredContent", featuredContentRouter);
app.use('/api/search', searchRouter)
app.use("/api/donationItem", donationItemRouter);
app.use("/api/donate", donationRouter);
app.use("/api/admin", adminRoute);

// init socket connection
global._io.on('connection', connectSocket);

// connect DB
connection();
