import React, { useEffect, useState } from "react";
import { addConnections } from "../utils/slices/connectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Match = () => {
  const connections = useSelector((state) => state.connections);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

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
  }, []);

  return (
    <div className="overflow-scroll">
      <div className="space-y-4">
        {connections.length == 0 && (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6388/6388056.png"
              alt="No matches"
              className="w-20 max-w-full"
            />
            <h2 className="text-lg font-semibold text-base-content">
              No Matches Yet
            </h2>
            <p className="text-sm text-base-content/60 max-w-md">
              It looks a bit quiet here... Start exploring profiles and make
              your first connection!
            </p>
          </div>
        )}

        {/* Header */}
        {connections.length != 0 && (
          <div className="px-2 text-lg font-semibold text-base-content">
            Your Matches ✨
          </div>
        )}
        {/* Connection List */}
        {connections.map((user) => (
          <div key={user?._id}>
            <div className="flex items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  className="w-12 h-12 rounded-xl object-cover cursor-pointer"
                  src={user?.photoUrl}
                  alt="photo"
                  onClick={() => setSelectedImage(user?.photoUrl)}
                />
                <div>
                  <div className=" text-xs  md:text-sm font-semibold text-base">
                    {user?.firstName} {user?.lastName}
                  </div>

                  <div className="text-xs  md:text-sm uppercase font-semibold text-base-content/60">
                    {user?.gender} • {user?.age} yrs
                  </div>
                </div>
              </div>

              {/* Message Button */}
              <button className="btn btn-xs md:btn-sm btn-outline btn-info">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4-.84L3 20l1.16-3.89A8.995 8.995 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                  />
                </svg>
                Chat
              </button>
            </div>
          </div>
        ))}
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
