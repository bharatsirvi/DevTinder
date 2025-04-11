require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const requestRouter = require("./router/requestRouter");
const userRouter = require("./router/userRouter");
require("./utils/cornjob");

const cors = require("cors");
const app = express();
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

connectDB()
  .then(() => {
    console.log("Database is Connected");
    app.listen(process.env.PORT, () => {
      console.log("server is Listening on port 7777");
    });
  })
  .catch(() => {
    console.log("Database is not connected");
  });
