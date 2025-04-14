import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import {
  incrementUnseenCount,
  resetUnseenCount,
} from "../utils/slices/unseenCounts";

const Chat = ({ targetUser, setChatWith, onlineStatus }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiContainerRef = useRef(null);

  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const targetUserId = targetUser?._id;

  const fetchChat = async () => {
    const res = await axios.get(BACKEND_BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    const chatData = res.data?.data;
    const allMessages = chatData?.messages || [];
    setMessages(allMessages);
  };

  useEffect(() => {
    fetchChat();
    const socket = createSocketConnection();
    dispatch(resetUnseenCount(targetUserId));
    socket.emit("joinChat", {
      userId,
      targetUserId,
    });
    socket.emit("markSeen", { userId, targetUserId });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);

      socket.emit("markSeen", { userId, targetUserId });
    });

    socket.on("messageSeen", ({ updatedMessages }) => {
      setMessages(updatedMessages);
    });

    return () =>{ socket.disconnect()
      dispatch(resetUnseenCount(targetUserId));
    };
  }, [targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle clicks outside emoji container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiContainerRef.current &&
        !emojiContainerRef.current.contains(event.target) &&
        showEmojis
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojis]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = {
      userId,
      targetUserId,
      content: message,
    };
    const socket = createSocketConnection();
    socket.emit("sendMessage", msgData);

    setMessage("");
    setShowEmojis(false); // Close emoji box when sending message
    inputRef.current?.focus();
  };

  // Common emojis
  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🔥",
    "✨",
    "🎉",
    "🙏",
    "😍",
    "🤔",
    "😢",
    "😎",
    "🥳",
    "😴",
    "👋",
    "🤗",
    "👀",
    "🥰",
    "😇",
    "🤩",
    "😋",
    "🤭",
    "😉",
    "💯",
    "👏",
    "🙌",
    "🤝",
    "✌️",
    "🤟",
    "🫶",
    "🤞",
  ];

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleEmojiBox = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setShowEmojis(!showEmojis);
  };

  return (
    <div className="flex flex-col w-full h-[80vh] max-w-md bg-base-100 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-base-100 p-4 flex items-center gap-3 border-b border-base-200">
        <button
          onClick={() => setChatWith(null)}
          className="btn btn-sm btn-circle btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="avatar online">
          <div className="w-10 rounded-full">
            <img
              src={targetUser.photoUrl || "/default-avatar.png"}
              alt="user"
            />
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <h2 className="font-bold text-sm">
            {targetUser.firstName} {targetUser.lastName}
          </h2>
          {onlineStatus && (
            <span className="text-xs text-success">• Online</span>
          )}
        </div>
      </div>

      {/* Chat Body - Adjust height based on emoji picker visibility */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200 transition-all duration-300"
        style={{
          maxHeight: showEmojis ? "calc(100% - 220px)" : "calc(100% - 120px)",
        }}
      >
        {(() => {
          const grouped = {};
          messages.forEach((msg) => {
            const date = new Date(msg.createdAt);
            const key = date.toDateString();
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(msg);
          });

          return Object.entries(grouped).map(([date, msgs], i) => {
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            let label = date;
            if (date === today) label = "Today";
            else if (date === yesterday) label = "Yesterday";
            return (
              <div key={i} className="space-y-2">
                <div className="divider text-xs text-base-content/70">
                  {label}
                </div>
                {msgs.map((msg, index) => {
                  const isMine = msg.senderId === userId;
                  const isLast =
                    index === msgs.length - 1 ||
                    msgs[index + 1].senderId !== msg.senderId;

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      } mb-1`}
                    >
                      <div className="max-w-[75%]">
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMine
                              ? "bg-info text-info-content"
                              : "bg-base-300 text-base-content"
                          }`}
                        >
                          {msg.message || msg.content}
                        </div>

                        {isLast && (
                          <div
                            className={`flex text-xs mt-1 text-base-content/70 ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>{formatTime(msg.createdAt)}</span>
                            {isMine && (
                              <span className="ml-2">
                                {msg.seenBy?.includes(targetUserId)
                                  ? "Seen"
                                  : "Sent"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          });
        })()}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker with Animation */}
      <div
        ref={emojiContainerRef}
        className={`bg-base-100 border-t border-base-200 overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          maxHeight: showEmojis ? "160px" : "0px",
          opacity: showEmojis ? 1 : 0,
          padding: showEmojis ? "10px" : "0 10px",
        }}
      >
        <div className="p-2 grid grid-cols-8 gap-3">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className="btn btn-ghost p-0 h-10 min-h-0 w-10 text-xl rounded-full hover:bg-base-200 transition-all duration-150"
              style={{
                transform: showEmojis ? "translateY(0)" : "translateY(20px)",
                opacity: showEmojis ? 1 : 0,
                transitionDelay: `${index * 10}ms`,
              }}
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-base-100 border-t border-base-200 flex items-center gap-2">
        <button
          className={`btn btn-circle btn-sm ${
            showEmojis ? "btn-primary" : "btn-ghost"
          }`}
          onClick={toggleEmojiBox}
        >
          <span className="text-lg">😊</span>
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="input input-bordered flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className={`btn btn-circle ${
            message.trim() ? "btn-secondary" : "btn-ghost btn-disabled"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
