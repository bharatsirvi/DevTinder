import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/slices/requestsSlice";
import { useNavigate } from "react-router-dom";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate()
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
    <div className="space-y-4 overflow-scroll">
      {requests.length != 0 && (
        <h2 className="px-2 text-sm text-base-content/60 tracking-wide font-semibold">
          You've got new connection requests!
        </h2>
      )}

      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
          <h2 className="text-lg font-semibold text-base-content">
            No Connection Requests Yet
          </h2>
          <p className="text-sm text-base-content/60 max-w-md">
            Looks like no one has reached out yet. Keep exploring and making
            connections!
          </p>
        </div>
      )}
      {requests.map((user) => {
        const profile = user?.fromUserId;
        const reqId = user?._id;
        return (
          <div
            key={profile?._id}
            className="flex items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <img
                src={
                  profile?.photoUrl ||
                  "https://api.dicebear.com/7.x/initials/svg?seed=" +
                    profile?.firstName
                }
                onClick={() => setSelectedImage(profile?.photoUrl)}
                alt="photo"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <div className="font-semibold text-xs  md:text-sm text-base">
                  {profile?.firstName + " " + profile?.lastName}
                </div>
                <div className="semibold text-xs md:text-sm text-base-content/60 font-medium uppercase tracking-wide">
                  {profile?.gender} • {profile?.age} yrs
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleReviewRequestClick("accepted", reqId)}
                className="btn btn-xs md:btn-sm btn-outline btn-success"
              >
                Accept
              </button>
              <button
                onClick={() => handleReviewRequestClick("rejected", reqId)}
                className="btn btn-xs md:btn-sm btn-outline btn-error"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      })}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-base-300 flex items-center justify-center z-50"
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

export default Request;
