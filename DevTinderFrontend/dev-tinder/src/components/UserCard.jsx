import React, { useState, useRef, useEffect } from "react";
import { AiOutlineLike, AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { removeUserFormFeed } from "../utils/slices/feedSlice";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { GrCaretNext } from "react-icons/gr";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);
  const initialTouchRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleSendRequestClick = async (status, userId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        BACKEND_BASE_URL + `/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      console.log("request" + status, response);

      // Animate the card off screen before removing it
      animateCardSwipe(status === "interested" ? "right" : "left");

      // Remove the user after animation completes
      setTimeout(() => {
        dispatch(removeUserFormFeed(userId));
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const animateCardSwipe = (direction) => {
    setIsAnimating(true);
    setSwipeDirection(direction);
    const screenWidth = window.innerWidth;
    const translateX =
      direction === "right" ? screenWidth + 100 : -screenWidth - 100;

    if (cardRef.current) {
      cardRef.current.style.transition =
        "transform 0.5s cubic-bezier(.13,.87,.7,.9), opacity 0.3s ease";
      cardRef.current.style.transform = `translate(${translateX}px, ${
        direction === "right" ? -50 : 50
      }px) rotate(${direction === "right" ? 30 : -30}deg)`;
      cardRef.current.style.opacity = 0;
    }
  };

  const resetCardPosition = () => {
    if (!cardRef.current) return;

    setSwipeDirection(null);
    cardRef.current.style.transition =
      "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    cardRef.current.style.transform = "translate(0px, 0px) rotate(0deg)";
    cardRef.current.style.opacity = 1;

    // Clear any pending animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleTouchStart = (e) => {
    if (isAnimating || !cardRef.current) return;

    const touch = e.touches ? e.touches[0] : e;
    initialTouchRef.current = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      timestamp: Date.now(),
    };

    setStartPosition({
      x: touch.clientX,
      y: touch.clientY,
    });
    setIsDragging(true);

    // Reset transitions for smooth dragging
    cardRef.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isAnimating || !cardRef.current) return;

    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - startPosition.x;
    const deltaY = touch.clientY - startPosition.y;

    setPosition({
      x: deltaX,
      y: deltaY,
    });

    // Apply smooth animation using requestAnimationFrame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Determine swipe direction for background indicators
      if (deltaX > 50) {
        setSwipeDirection("right");
      } else if (deltaX < -50) {
        setSwipeDirection("left");
      } else {
        setSwipeDirection(null);
      }

      // Add rotation effect based on swipe direction - more subtle and natural feeling
      const rotation = deltaX * 0.08; // Reduced rotation factor for more subtle effect

      // Apply transform with damping for more natural feel
      cardRef.current.style.transform = `translate(${deltaX}px, ${
        deltaY * 0.5
      }px) rotate(${rotation}deg)`;

      // Change opacity based on swipe distance for card tilt effect
      const absX = Math.abs(deltaX);
      const opacity = 1 - Math.min(absX / 250, 0.2);
      cardRef.current.style.opacity = opacity;
    });
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || isAnimating || !cardRef.current) return;

    // Calculate velocity for more natural swipe physics
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const endTime = Date.now();
    const deltaTime = endTime - initialTouchRef.current.timestamp;

    const deltaX = touch.clientX - initialTouchRef.current.clientX;
    const velocityX = Math.abs(deltaX) / deltaTime;

    setIsDragging(false);

    // Threshold to determine if swipe was significant enough
    // Consider both distance and velocity for a more natural feel
    const distanceThreshold = 100;
    const velocityThreshold = 0.5; // pixels per millisecond

    if (
      position.x > distanceThreshold ||
      (position.x > 20 && velocityX > velocityThreshold && deltaX > 0)
    ) {
      // Right swipe - Connect
      handleSendRequestClick("interested", user._id);
    } else if (
      position.x < -distanceThreshold ||
      (position.x < -20 && velocityX > velocityThreshold && deltaX < 0)
    ) {
      // Left swipe - Skip
      handleSendRequestClick("ignored", user._id);
    } else {
      // Reset position if not swiped far enough
      resetCardPosition();
    }
  };

  // Clean up animation frames
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Add event listeners for mouse events (for desktop)
  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    card.addEventListener("mousedown", handleTouchStart);
    window.addEventListener("mousemove", handleTouchMove);
    window.addEventListener("mouseup", handleTouchEnd);

    return () => {
      card.removeEventListener("mousedown", handleTouchStart);
      window.removeEventListener("mousemove", handleTouchMove);
      window.removeEventListener("mouseup", handleTouchEnd);
    };
  }, [isDragging, position, startPosition, isAnimating]);

  return (
    <div className="w-full max-w-sm mx-auto my-8 relative">
      {/* Background Indicators */}
      <div className="absolute inset-0 left-0 right-0 overflow-hidden rounded-2xl z-0">
        {/* LIKE indicator (right) */}
        <div
          className={`absolute right-0 top-0 h-full flex items-center justify-center pl-8 transition-all duration-200 ${
            swipeDirection === "right"
              ? "opacity-100 scale-100 -translate-x-10"
              : "opacity-0 scale-95 translate-x-10"
          }`}
        >
          <div className="border-4 border-green-500 rounded-xl px-6 py-3 bg-green-500/10 backdrop-blur-sm">
            <span className="text-green-500 text-2xl md:text-4xl font-bold uppercase tracking-wider">
              LIKE
            </span>
          </div>
        </div>

        {/* NOPE indicator (left) */}
        <div
          className={`absolute left-0 top-0 h-full flex items-center justify-center pr-8 transition-all duration-200 ${
            swipeDirection === "left"
              ? "opacity-100 scale-100 translate-x-10"
              : "opacity-0 scale-95 -translate-x-10"
          }`}
        >
          <div className="border-4 border-red-500 rounded-xl px-5 py-3 bg-red-500/10 backdrop-blur-sm">
            <span className="text-red-500 text-2xl md:text-4xl font-bold uppercase tracking-wider">
              NOPE
            </span>
          </div>
        </div>
      </div>

      {/* Animated background gradients for better visual feedback */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl z-0">
        {/* Right swipe gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-r to-transparent from-green-500/30 transition-opacity duration-300 ${
            swipeDirection === "right" ? "opacity-70" : "opacity-0"
          }`}
        />

        {/* Left swipe gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-l to-transparent from-red-500/30 transition-opacity duration-300 ${
            swipeDirection === "left" ? "opacity-70" : "opacity-0"
          }`}
        />
      </div>

      {/* Main Card - Full Image with Content Overlay */}
      <div
        ref={cardRef}
        className="relative w-full aspect-[3/5] rounded-2xl overflow-hidden shadow-xl cursor-grab active:cursor-grabbing z-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "none",
        }}
      >
        {/* Full Image Background */}
        <img
          src={
            user.photoUrl ||
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
          }
          alt={`${user.firstName}'s profile`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent z-10" />

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-10" />

        {/* Bottom Content Area - Main Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
          {/* User Name */}
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {user.firstName} {user.lastName}
          </h2>

          {/* Age and Gender Pills */}
          <div className="flex gap-2 mb-2 md:mb-4 text-[10px] md:text-xs">
            <div className="flex items-center overflow-hidden rounded-lg border border-white/30">
              <div className="bg-info-content px-2 py-1">
                <span className="text-white uppercasefont-bold">GENDER</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1">
                <span className="text-white uppercase ">{user.gender}</span>
              </div>
            </div>

            <div className="flex items-center overflow-hidden rounded-lg border border-white/30">
              <div className="bg-info-content px-2 py-1">
                <span className="text-white uppercasefont-bold">AGE</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1">
                <span className="text-white ">{user.age}</span>
              </div>
            </div>
          </div>

          {/* Show More Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent swipe handling when clicking button
              setShowDetails(!showDetails);
            }}
            className="w-full py-1 md:py-2 mb-4 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px] md:text-xs font-medium hover:bg-white/30 transition-all"
          >
            {showDetails ? "Hide Details" : "View More Details"}
          </button>

          {/* Expandable Details Section */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDetails ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
            }`}
          >
            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <h3 className="w-full text-xs md:text-sm font-semibold mb-0 md:mb-2">
                  Skills
                </h3>
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white  text-[10px] md:text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* About Section */}
            {user.about && (
              <div className="mb-2">
                <h3 className="text-xs md:text-sm font-semibold mb-1 md:mb-2">About</h3>
                <p className="text-white/90 text-[10px] md:text-sm">{user.about}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2 md:mt-4 text-xs md:text-lg">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent swipe handling when clicking button
                setSwipeDirection("left");
                handleSendRequestClick("ignored", user._id);
              }}
              disabled={isLoading || isAnimating}
              className="flex-1 py-2 md:py-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 text-black font-semibold flex items-center justify-center gap-2 hover:from-gray-500 hover:to-gray-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <GrCaretNext />
              <span>Skip</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent swipe handling when clicking button
                setSwipeDirection("right");
                handleSendRequestClick("interested", user._id);
              }}
              disabled={isLoading || isAnimating}
              className="flex-1 py-2 md:py-3 rounded-full bg-gradient-to-r from-secondary/90 to-info/90 text-white font-semibold flex items-center justify-center gap-2  hover:from-pink-600 hover:to-sky-600 transition-all cursor-pointer disabled:opacity-50"
            >
              <AiOutlineLike />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
