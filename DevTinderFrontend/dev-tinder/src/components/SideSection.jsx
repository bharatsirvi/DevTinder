import React, { useState } from "react";

import Match from "./Match";
import Request from "./Request";
import { useSelector } from "react-redux";

const SideSection = () => {
  const [tab, setTab] = useState(0);
  const requests = useSelector((state) => state.requests);

  return (
    <div className="flex left-0 md:fixed md:w-1/3 flex-col h-screen bg-base-300 shadow-md">
      {/* Header Buttons */}
      <div className="relative flex justify-around p-4 shadow-sm bg-base-200">
        {/* Buttons */}
        <button
          onClick={() => setTab(0)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 
      ${tab === 0 ? "text-info" : "text-info/70 hover:text-info"}`}
        >
          Matches
        </button>
        <button
          onClick={() => setTab(1)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 
      ${tab === 1 ? "text-info" : "text-info/70 hover:text-info"}`}
        >
          Requests
          {requests.length != 0 && (
            <div className="ml-1 badge badge-xs badge-secondary">
              {requests.length + "+"}
            </div>
          )}
        </button>

        {/* Animated Bottom Bar */}
        <span
          className={`absolute bottom-0 left-0 w-1/2 h-0.5 bg-info rounded transition-transform duration-300 ease-in-out`}
          style={{
            transform: `translateX(${tab * 100}%)`,
          }}
        />
      </div>
      {/* Scrollable Content Area */}
      <div className=" flex-1 overflow-y-auto p-4 space-y-4">
        {tab == 0 ? <Match /> : <Request />}
      </div>
    </div>
  );
};

export default SideSection;
