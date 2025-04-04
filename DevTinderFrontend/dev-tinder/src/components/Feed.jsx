import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/slices/feedSlice";
import ErrorPage from "./Error";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get(BACKEND_BASE_URL + "/user/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data.data));
      } catch (err) {
        if (err.status == 401) navigate("/login");
        else return <ErrorPage />;
      }
    };

    getFeed();
  }, [dispatch]);

  return (
    <div className="w-full z-0 flex justify-center items-start px-4 py-4">
      <div className="w-full md:w-1/2">
        {feed.length > 0 ? (
          <UserCard user={feed[0]} key={feed[0]._id} />
        ) : (
          <div className="mt-20 rounded-xl px-10 py-10 flex flex-col items-center justify-center text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7466/7466140.png"
              alt="No Feed Illustration"
              className="w-32 h-auto mb-6 text-info"
            />
            <h2 className=" text-xl md:text-2xl font-bold mb-2">
              No Suggestions Yet
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mb-4">
              Looks like your feed is empty right now. Connect with more people
              or update your profile to discover suggestions.
            </p>
            {/* <button
              className="btn btn-info"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Update Profile
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
