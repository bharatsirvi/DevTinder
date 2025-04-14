import React, { useState } from "react";
import Match from "./Match";
import Request from "./Request";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const SideSection = () => {
  const [tab, setTab] = useState(0);
  const requests = useSelector((state) => state.requests);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-base-100 to-base-200 border-r border-base-300 shadow-lg">
      {/* Header Buttons */}
      <div className="relative px-2 pt-4 pb-2 bg-base-100 border-b border-base-300">
        <div className="flex justify-around rounded-lg bg-base-200 p-1 relative">
          {/* Tab Buttons */}
          {["Matches", "Requests"].map((item, index) => (
            <button
              key={item}
              onClick={() => setTab(index)}
              className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center ${
                tab === index
                  ? "text-neutral"
                  : "text-base-content/80 hover:text-base-content"
              }`}
            >
              {item}
              {index === 1 && requests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-secondary text-secondary-content">
                  {requests.length}
                </span>
              )}
            </button>
          ))}

          {/* Animated Background */}
          <motion.div
            className={`absolute top-1 bottom-1 left-1 bg-info/80 rounded-md shadow-sm`}
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
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {tab === 0 ? <Match /> : <Request />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SideSection;
