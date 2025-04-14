require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middleware/auth");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const requestRouter = require("./router/requestRouter");
const userRouter = require("./router/userRouter");
const chatRouter = require("./router/chatRouter");

// require("./utils/cornjob");
const cors = require("cors");
const app = express();
const {initializeSocket} = require("./utils/socket");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database is Connected");
    server.listen(process.env.PORT || 7777, () => {
      console.log("server is Listening on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Database is not connected");
  });
