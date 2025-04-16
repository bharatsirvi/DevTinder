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
  ) : connections.length != 0 ? (
    <div className="p-1">
      <div className="">
        <div className="px-4 py-4 bg-gradient-to-r to-base-100 from-info/10 rounded-lg mb-2">
          <div className="flex flex-col md:flex-row justify-center md:items-center gap-2">
            <h2 className="text-md md:text-lg font-bold text-neatral-100">
              People You've Matched With
            </h2>
            <span className="ml-auto px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
              {connections.length} connections
            </span>
          </div>
        </div>

        {/* Connection List */}
        <div className="flex flex-col  gap-2 ">
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
                        <span className="hiddenmd:block text-xs text-success">
                          • Online
                        </span>
                      )}
                    </div>

                    <p className="text-xs capitalize font-medium text-base-content/60 mt-0.5">
                      {user?.gender}{" "}
                      {user?.age > 0 && " • " + user?.age + " Yrs"}
                    </p>

                    {unseenCounts[user._id] > 0 && (
                      <span className="mt-1 text-xs text-center font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
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
  ) : (
    <div className="flex flex-col items-center justify-start mt-10 h-[70vh] px-4 text-center">
      <div className="relative w-36 h-36 mb-20 ">
        {/* Card stack effect */}
        <div className="absolute left-6 top-6 w-36 h-36 bg-secondary/10 rounded-2xl transform rotate-[-12deg] shadow-lg"></div>
        <div className="absolute left-2 top-2 w-36 h-36 bg-info/20 rounded-2xl transform rotate-[-6deg] shadow-lg"></div>

        {/* Main empty card */}
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 to-base-300 rounded-2xl shadow-xl   flex flex-col items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-secondary/5 rounded-2xl"></div>

          {/* Question mark inside card */}
          <div className="text-8xl font-bold text-neutral-600 mb-2 opacity-20">
            ?
          </div>

          {/* Placeholder silhouette */}
          <svg
            className="w-24 h-24 text-neutral-600 opacity-20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-base-content mb-3">
        No Matches Yet
      </h2>

      <p className="text-xs md:text-sm text-base-content/70 max-w-md mb-6">
        Looks like you haven't made any connections yet. Keep swiping to
        discover new people who might be a perfect match!
      </p>

      <button
        onClick={() => navigate("/")}
        className="btn btn-sm btn-outline btn-info font-semibold px-6 py-2 md:py-3 rounded-full "
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          ></path>
        </svg>
        Start Swiping
      </button>

      {/* Visual decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-info/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Match;
