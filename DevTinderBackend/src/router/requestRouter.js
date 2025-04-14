const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequestModel");
const sendEmail = require("../utils/sendEmail");
const {
  validateSendRequest,
  validateReviewRequest,
} = require("../utils/validate");
const { getIO, onlineUsers } = require("../utils/socket");
const requestRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      await validateSendRequest(req);
      const fromUserId = req.user._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();

      const puplatedRequest = await connectionRequest.populate(
        "fromUserId",
        USER_SAFE_DATA
      );
      if (status == "interested") {
        const io = getIO();
        const targetSocketId = onlineUsers.get(toUserId);

        if (targetSocketId) {
          io.to(targetSocketId).emit("newRequest", puplatedRequest);
        }
      }
      res.json({
        message: "Request Sent Successfully",
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).json({
        type: "error",
        message: error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      validateReviewRequest(req);
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("toUserId", USER_SAFE_DATA);

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Request not found",
        });
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      if (connectionRequest.status == "accepted") {
        const io = getIO();
        console.log(connectionRequest.fromUserId);
        console.log(onlineUsers);
        const targetSocketId = onlineUsers.get(
          connectionRequest.fromUserId.toString()
        );
        console.log("target socket id", targetSocketId);
        const newAcceptedRequest = connectionRequest.toUserId;
        if (targetSocketId) {
          io.to(targetSocketId).emit("requestAccepted", newAcceptedRequest);
        }
      }

      res.json({
        message: "Request Review Successfully",
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).json({
        type: "error",
        message: error.message,
      });
    }
  }
);

module.exports = requestRouter;
