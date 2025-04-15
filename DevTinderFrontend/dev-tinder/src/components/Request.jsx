import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/slices/requestsSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleReviewRequestClick = async (status, reqId) => {
    try {
      await axios.post(
        `${BACKEND_BASE_URL}/request/review/${status}/${reqId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(reqId));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/user/requests/received`,
        { withCredentials: true }
      );
      dispatch(addRequests(response.data.data));
    } catch (error) {
      if (error.status == 401) navigate("/login");
      else return <ErrorPage />;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-1">
      <div className="max-w-2xl mx-auto space-y-6">
        {requests.length != 0 && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-base-content flex items-center gap-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            New Connection Requests ({requests.length})
          </motion.h2>
        )}

        {requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center p-8 rounded-xl bg-gradient-to-b from-base-100 to-base-100/50 shadow-md border border-base-200"
          >
            {/* Decorative elements */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="w-20 md:w-28 h-20 md:h-28 mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden"
              >
                {/* Animated rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute w-full h-full rounded-full border-4 border-dashed border-primary/20"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 md:h-14 w-10 md:w-14 text-base-content/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </motion.div>

              {/* Small decorative dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full bg-secondary/30"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-6 left-0 -ml-2 w-3 h-3 rounded-full bg-primary/30"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-md md:text-xl font-bold text-base-content mb-3"
            >
              No Connection Requests
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xs md:text-sm text-base-content/60 max-w-md mb-5"
            >
              Your network is growing! While you wait, try reaching out to
              others first and make meaningful connections.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2"
            >
              <button className="btn btn-sm btn-outline btn-info gap-2 rounded-full px-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Discover People
              </button>
            </motion.div>
          </motion.div>
        )}
        <AnimatePresence>
          {requests.map((user) => {
            const profile = user?.fromUserId;
            const reqId = user?._id;
            return (
              <motion.div
                key={profile?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm border border-base-200 hover:shadow-md transition-all duration-300"
              >
                {/* Profile Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedImage(profile?.photoUrl)}
                  >
                    <img
                      src={
                        profile?.photoUrl ||
                        "https://api.dicebear.com/7.x/initials/svg?seed=" +
                          profile?.firstName
                      }
                      alt="photo"
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-info/10 rounded-xl transition-all"></div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">
                      {profile?.firstName + " " + profile?.lastName}
                    </div>
                    <div className="text-[10px] md:text-xs text-base-content/60 font-medium capitalize tracking-wide flex items-center gap-2">
                      <span>{profile?.gender}</span>
                      <span className="w-1 h-1 rounded-full bg-base-content/30"></span>
                      <span>{profile?.age} <span className="hidden md:inline">years</span></span>
                    </div>
                    {profile?.bio && (
                      <p className="text-xs text-base-content/70 mt-1 truncate">
                        "{profile.bio}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-2 ml-4">
                  <button
                    onClick={() => handleReviewRequestClick("accepted", reqId)}
                    className="btn btn-xs md:btn-sm border-info bg-info/10 text-info rounded-lg px-4 min-h-8 h-8 hover:bg-info/20"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReviewRequestClick("rejected", reqId)}
                    className="btn  btn-xs md:btn-sm btn-ghost rounded-lg px-4 min-h-8 h-8 border border-base-300 hover:border-error/30 hover:bg-error/10 hover:text-error"
                  >
                    Decline
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative bg-base-100 rounded-xl overflow-hidden shadow-2xl p-2 max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged profile"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-error text-error-content rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Request;
