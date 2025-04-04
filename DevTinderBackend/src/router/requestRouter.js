const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequestModel");
const sendEmail = require("../utils/sendEmail");
const {
  validateSendRequest,
  validateReviewRequest,
} = require("../utils/validate");
const requestRouter = express.Router();

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
      // const emailRes = await sendEmail.run(
      //   `Someone ${status} you`,
      //    req.user.firstName
      // );
      // console.log("email res", emailRes);
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
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Request not found",
        });
      }
      connectionRequest.status = status;
      await connectionRequest.save();
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
