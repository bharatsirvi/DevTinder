const express = require("express");
const { userAuth } = require("../middleware/auth");
const chatRouter = express.Router();
const Chat = require("../models/chatModel");
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }
    res.json({ data: chat });
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
