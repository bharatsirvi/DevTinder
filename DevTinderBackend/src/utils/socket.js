const { Server } = require("socket.io");
const Chat = require("../models/chatModel");
const onlineUsers = new Map();
let ioInstance;
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  ioInstance = io;
  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // User comes online
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User online:",userId,"  ", socket.id);

      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("room id ==> ", roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ userId, targetUserId, content }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      //store in database
      try {
        let chat = await Chat.findOne({
          participants: {
            $all: [userId, targetUserId],
          },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }
        const newMessage = {
          senderId: userId,
          message: content,
          createdAt: new Date(),
        };
        chat.messages.push(newMessage);
        await chat.save();

        io.to(roomId).emit("receiveMessage", newMessage);

        io.emit("newMessageReceived", {
          from: userId,
          to: targetUserId,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("markSeen", async ({ userId, targetUserId }) => {
      console.log("mark seen called");
      const roomId = [userId, targetUserId].sort().join("_");

      try {
        const chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (chat) {
          const updatedMessages = chat.messages.map((msg) => {
            if (
              msg.senderId.toString() !== userId &&
              !msg.seenBy.includes(userId)
            ) {
              msg.seenBy.push(userId);
            }
            return msg;
          });

          await chat.save();

          io.to(roomId).emit("messageSeen", { updatedMessages });
        }
      } catch (error) {
        console.error("Error in markSeen:", error);
      }
    });

    socket.on("getUnseenMessageCounts", async (userId) => {
      try {
        const chats = await Chat.find({
          participants: userId,
        });

        const unseenCounts = {};

        chats.forEach((chat) => {
          const friendId = chat.participants.find(
            (id) => id.toString() !== userId
          );

          const unseenMessages = chat.messages.filter(
            (msg) =>
              msg.senderId.toString() === friendId.toString() &&
              !msg.seenBy.includes(userId)
          );

          unseenCounts[friendId] = unseenMessages.length;
        });

        socket.emit("unseenMessageCounts", unseenCounts);
      } catch (error) {
        console.error("Error fetching unseen message counts:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};
const getIO = () => ioInstance;

module.exports = { initializeSocket, getIO, onlineUsers };
