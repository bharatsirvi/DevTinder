import React, { useEffect, useState } from "react";
import { addConnections } from "../utils/slices/connectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import ErrorPage from "./Error";

const Match = () => {
  const connections = useSelector((state) => state.connections);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const unseenCounts = useSelector((state) => state.unseenCounts);
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  const [selectedImage, setSelectedImage] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChatClick = (user) => {
    setChatWith(user);
  };
  const fetchMatches = async () => {
    try {
      const response = await axios.get(BACKEND_BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(response.data.data));
    } catch (error) {
      if (error.status == 401) navigate("/login");
      else return <ErrorPage />;
    }
  };

  useEffect(() => {
    fetchMatches();
    return () => {
      setChatWith(null);
    };
  }, [userId]);

  return chatWith != null ? (
    <Chat
      targetUser={chatWith}
      setChatWith={setChatWith}
      onlineStatus={onlineUsers.includes(chatWith._id)}
    />
  ) : (
    <div className="h-[80vh]">
      <div className="">
        {connections.length !== 0 && (
          <div className="px-4 py-4 bg-gradient-to-r to-base-100 from-info/10 rounded-lg my-2">
            <div className="flex flex-col md:flex-row justify-center md:items-center gap-2">
              <h2 className="text-md md:text-lg font-bold text-neatral-100">
                People You've Matched With
              </h2>
              <span className="ml-auto px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
                {connections.length} connections
              </span>
            </div>
          </div>
        )}

        {/* Connection List */}
        <div className="flex flex-col h-[80vh] gap-2">
          {connections.map((user) => (
            <div key={user?._id}>
              <div className="flex items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-base-200 hover:border-info/30">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                  {/* Avatar with online indicator */}
                  <div className="relative w-14 h-14">
                    <img
                      src={user?.photoUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-lg border-2 border-base-100 cursor-pointer"
                      onClick={() => setSelectedImage(user?.photoUrl)}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
                        onlineUsers.includes(user._id)
                          ? "bg-green-500 shadow-[0_0_4px_1px_rgba(34,197,94,0.3)]"
                          : "bg-gray-400"
                      }`}
                    ></span>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm capitalize font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      {onlineUsers.includes(user._id) && (
                        <span className="text-xs text-success">• Online</span>
                      )}
                    </div>

                    <p className="text-xs capitalize font-medium text-base-content/60 mt-0.5">
                      {user?.gender} • {user?.age} yrs
                    </p>

                    {unseenCounts[user._id] > 0 && (
                      <span className="mt-1 text-xs text-center font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                        {unseenCounts[user._id]} new message
                        {unseenCounts[user._id] > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chat Button */}
                <button
                  onClick={() => handleChatClick(user)}
                  className="btn btn-sm bg-info/10 text-info border-0 rounded-full px-3 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4-.84L3 20l1.16-3.89A8.995 8.995 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                    />
                  </svg>
                  <span className="ml-1.5">Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-base-300/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative bg-base-100 rounded-xl overflow-hidden shadow-lg p-4 max-w-[90%] max-h-[90%]">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="cursor-pointer hover:scale-110 absolute top-5 right-5 text-base-content text-xl"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;
