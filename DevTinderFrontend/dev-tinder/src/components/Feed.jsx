import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/slices/feedSlice";
import ErrorPage from "./Error";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const navigate = useNavigate();
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
      <div className="w-9/12 md:w-1/2 mt-10 md:mt-0">
        {feed.length > 0 ? (
          <UserCard user={feed[0]} key={feed[0]._id} />
        ) : (
          <div className="relative mt-20 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50 shadow-xl overflow-hidden">
            {/* Floating dots background */}
            <div className="absolute inset-0 -z-10">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-secondary/10"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${
                      Math.random() * 10 + 10
                    }s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>

            {/* Animated illustration */}
            <div className="relative mb-8 group">
              <div className="absolute -inset-4 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/7466/7466140.png"
                alt="No Feed Illustration"
                className="w-32 h-32 md:w-40 md:h-40 transform transition-all duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content with subtle animations */}
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-info">
                No Suggestions
              </h2>

              <p className="text-base-content/70 text-sm md:text-base leading-relaxed">
                Looks like your feed is empty right now. Connect with more
                people or update your profile to discover suggestions.
              </p>

              <div className="pt-6">
                <button
                  className="relative text-base-300 overflow-hidden btn bg-gradient-to-r from-secondary to-info rounded-full px-8 shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-1"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">✨</span>
                    Update Profile
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary to-info opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>

            {/* CSS for floating animation (add to your global CSS) */}
            <style jsx>{`
              @keyframes float {
                0%,
                100% {
                  transform: translateY(0) translateX(0);
                }
                25% {
                  transform: translateY(-20px) translateX(10px);
                }
                50% {
                  transform: translateY(10px) translateX(-10px);
                }
                75% {
                  transform: translateY(-10px) translateX(15px);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
