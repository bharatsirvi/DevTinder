import React, { useState } from "react";
import Match from "./Match";
import Request from "./Request";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const SideSection = () => {
  const [tab, setTab] = useState(0);
  const requests = useSelector((state) => state.requests);

  return (
    <div className="flex flex-col bg-gradient-to-b from-base-100 to-base-200shadow-lg">
      {/* Header Buttons */}
      <div className="px-2 z-40 pt-4 fixed  left-0 right-0 md:left-0 md:right-2/3 pb-2 bg-base-100 ">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-info/50 via-secondary/40 to-transparent opacity-80"></div>
        </div>
        <div className="flex  justify-around items-center rounded-lg bg-base-200 p-1 relative">
          {/* Tab Buttons */}
          {["Matches", "Requests"].map((item, index) => (
            <button
              key={item}
              onClick={() => setTab(index)}
              className={`relative cursor-pointer z-10 px-6 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center ${
                tab === index
                  ? "text-base-content/80"
                  : "text-base-content/80 hover:text-base-content"
              }`}
            >
              <div className="flex items-center">
                <span>{item}</span>
                {index === 1 && requests.length > 0 && (
                  <div className="ml-2 flex items-center">
                    <span className="relative flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 animate-ping"></span>
                      <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary/80 text-white text-[10px] font-bold">
                        {requests.length > 9 ? "9+" : requests.length}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Animated Background */}
          <motion.div
            className={`absolute top-1 bottom-1 left-1 bg-gradient-to-l from-secondary/50 to-info/30 rounded-md shadow-sm`}
            initial={false}
            animate={{
              left: `${tab * 50}%`,
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="fixed left-0 right-0 md:left-0 md:right-2/3 mt-16 h-[80vh] overflow-y-auto justify-center p-4 [scrollbar-width:none] [-ms-overflow-style:none]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 0 ? <Match /> : <Request />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SideSection;
