import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/slices/feedSlice";
import ErrorPage from "./Error";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import UserCardSkeleton from "./UserCardSkeleton";

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(BACKEND_BASE_URL + "/user/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data.data));
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, [dispatch, navigate]);

  if (error) {
    return <ErrorPage />;
  }

  // Show only top 3 cards in stack
  const MAX_VISIBLE_CARDS = 3;

  return (
    <div className="w-full h-screen z-0 flex justify-center items-start px-4 py-4">
      <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
        {loading ? (
          <UserCardSkeleton />
        ) : feed.length > 0 ? (
          <div className="relative w-[80%] aspect-[3/5] mx-auto md:mt-8">
            {feed.slice(0, 3).map((user, i) => (
              <div
                key={user._id}
                className="absolute w-full h-full transition-all duration-200 origin-bottom"
                style={{
                  zIndex: 30 - i * 10,
                  transform: `translateY(${i * 2}px) rotate(${i * 1.5}deg)`,

                  ...(i === 0 && {
                    cursor: "pointer",
                    filter: "brightness(1.02)",
                  }),
                }}
              >
                <div className={`card h-full ${i != 0 && "pointer-events-none"}`}>
                  <UserCard user={user} />
                </div>
              </div>
            ))}
          </div>
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
              <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-info">
                No Suggestions
              </h2>

              <p className="text-base-content/70 text-xs md:text-sm leading-relaxed">
                Looks like your feed is empty right now. Connect with more
                people or update your profile to discover suggestions.
              </p>

              <div className="pt-6">
                <button
                  className="relative text-base-300 overflow-hidden btn bg-gradient-to-r from-secondary to-info rounded-full px-2 md:px-8 shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-1"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <span className="relative z-10 flex text-xs md:text-md items-center">
                    <span className="mr-1 md:mr-2">✨</span>
                    Update Profile
                    <span className="ml-1 md:ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary to-info opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>

            {/* CSS for floating animation */}
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
