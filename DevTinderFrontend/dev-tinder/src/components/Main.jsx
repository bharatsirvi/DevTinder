import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideSection from "./SideSection";

const Main = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  console.log(showSidebar);
  const location = useLocation();

  useEffect(() => {
    // Automatically hide sidebar on /profile
    if (location.pathname === "/profile") {
      setShowSidebar(false);
    }
  }, [location]);

  return (
    <>
      <div className="flex h-full justify-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed bottom-0 right-0 z-100 md:hidden m-4 btn-sm btn btn-secondary text-white "
        >
          {showSidebar ? "← back" : "See All Connections →"}
        </button>

        <div
          className={`${
            !showSidebar && "hidden md:block"
          } z-10 absolute md:relative w-full sm:w-3/6 md:w-1/3`}
        >
          <SideSection />
        </div>
        <div
          className={`${
            showSidebar && "z-0 hidden md:block"
          } absolute h-auto md:relative w-full sm:w-3/6 md:w-2/3`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Main;
