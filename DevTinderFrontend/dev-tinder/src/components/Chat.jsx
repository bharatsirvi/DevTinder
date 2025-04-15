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

    return () => {
      socket.disconnect();
      dispatch(resetUnseenCount(targetUserId));
    };
  }, [targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setShowEmojis(false);
    inputRef.current?.focus();
  };

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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleEmojiBox = (e) => {
    e.stopPropagation();
    setShowEmojis(!showEmojis);
  };

  return (
    <div className="flex mt-2 flex-col w-full h-[75vh] max-w-md bg-base-100 rounded-xl overflow-hidden shadow-lg border border-base-200">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-info/10 to-transparent p-4 flex items-center gap-3">
        <button
          onClick={() => setChatWith(null)}
          className="btn btn-circle btn-ghost btn-sm text-base-content hover:bg-white/20"
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

        <div className="avatar">
          <div className="w-10 rounded-full ring-1 ring-secondary ring-offset-base-100 ring-offset-2">
            <img
              src={targetUser.photoUrl || "/default-avatar.png"}
              alt={targetUser.firstName}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base-content truncate">
            {targetUser.firstName} {targetUser.lastName}
          </h2>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                onlineStatus ? "bg-success" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-base-content/90">
              {onlineStatus ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div
        className="flex-1 [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto p-4 space-y-4 bg-base-100 transition-all duration-300 
       bg-[radial-gradient(rgba(212,212,216,0.2)_1px,transparent_1px)] [background-size:16px_16px]
       dark:bg-[radial-gradient(rgba(63,63,70,0.2)_1px,transparent_1px)]"
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
              <div key={i} className="space-y-3">
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-base-300"></div>
                  <span className="px-3 text-xs font-medium text-base-content/50">
                    {label}
                  </span>
                  <div className="flex-1 border-t border-base-300"></div>
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
                      }`}
                    >
                      <div
                        className={`max-w-[80%] flex ${
                          isMine ? "flex-col items-end" : "flex-col items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMine
                              ? "bg-pink-300 text-neutral rounded-tr-none"
                              : "bg-base-200 text-base-content rounded-tl-none"
                          } shadow-sm`}
                        >
                          {msg.message || msg.content}
                        </div>

                        {isLast && (
                          <div
                            className={`flex items-center mt-1 text-xs text-base-content/50 ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>{formatTime(msg.createdAt)}</span>
                            {isMine && (
                              <span className="ml-1.5">
                                {msg.seenBy?.includes(targetUserId) ? (
                                  <span className="text-success">✓✓</span>
                                ) : (
                                  <span>✓</span>
                                )}
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

      {/* Emoji Picker */}
      <div
        ref={emojiContainerRef}
        className={`bg-base-100 border-t border-base-200 overflow-hidden transition-all duration-300 ease-in-out ${
          showEmojis ? "shadow-inner" : ""
        }`}
        style={{
          maxHeight: showEmojis ? "160px" : "0px",
          opacity: showEmojis ? 1 : 0,
          padding: showEmojis ? "12px" : "0 12px",
        }}
      >
        <div className="p-2 grid grid-cols-8 gap-2">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className="btn btn-ghost p-0 h-9 min-h-0 w-9 text-xl rounded-full hover:bg-base-200 active:scale-90 transition-all duration-150"
              style={{
                transform: showEmojis ? "scale(1)" : "scale(0)",
                opacity: showEmojis ? 1 : 0,
                transitionDelay: `${index * 20}ms`,
              }}
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 bg-base-100 border-t border-base-200 flex items-center gap-2">
        <button
          className={`btn btn-circle btn-sm ${
            showEmojis ? "btn-secondary" : "btn-ghost"
          }`}
          onClick={toggleEmojiBox}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="input  flex-1 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              e.target.blur();
            }
          }}
        />

        <button
          onClick={() => {
            sendMessage();
            inputRef.current?.blur();
          }}
          disabled={!message.trim()}
          className={`btn btn-circle btn-sm ${
            message.trim() ? "btn-secondary" : "btn-ghost"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
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
