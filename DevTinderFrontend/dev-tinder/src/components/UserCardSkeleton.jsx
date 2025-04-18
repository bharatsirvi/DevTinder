import React from "react";

const UserCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto my-8 relative">
      {/* Main Card Skeleton */}
      <div className="relative w-full aspect-[3/5] rounded-2xl overflow-hidden shadow-xl bg-base-200 animate-pulse">
        {/* Top Gradient Overlay Skeleton */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-base-200/70 to-transparent z-10" />

        {/* Bottom Gradient Overlay Skeleton */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-base-200/90 via-base-200/70 to-transparent z-10" />

        {/* Bottom Content Area Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          {/* Name Skeleton */}
          <div className="h-6 w-3/4 bg-base-300 rounded-full mb-4"></div>

          {/* Age and Gender Pills Skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-base-300 rounded-full"></div>
            <div className="h-6 w-16 bg-base-300 rounded-full"></div>
          </div>

          {/* View More Button Skeleton */}
          <div className="h-8 w-full bg-base-300 rounded-lg mb-4"></div>

          {/* Skills Section Skeleton */}
          <div className="mb-4">
            <div className="h-4 w-16 bg-base-300 rounded-full mb-2"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-16 bg-base-300 rounded-full"
                ></div>
              ))}
            </div>
          </div>

          {/* About Section Skeleton */}
          <div className="mb-4">
            <div className="h-4 w-16 bg-base-300 rounded-full mb-2"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-base-300 rounded-full"></div>
              <div className="h-3 w-5/6 bg-base-300 rounded-full"></div>
              <div className="h-3 w-4/6 bg-base-300 rounded-full"></div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 h-10 bg-base-300 rounded-full"></div>
            <div className="flex-1 h-10 bg-base-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;
