import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideSection from "./SideSection";
import { useDispatch, useSelector } from "react-redux";
import { setShowSidebar } from "../utils/slices/configSlice";

const Main = () => {
  const { showSidebar } = useSelector((store) => store.config);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/profile") {
      dispatch(setShowSidebar(false));
    }
    if (location.pathname === "/") {
      dispatch(setShowSidebar(false));
    }
  }, [location]);

  return (
    <>
      <div className="flex justify-center">
        <div
          className={`${
            !showSidebar && "hidden md:block"
          } z-10 absolute md:fixed shadow-lg left-0 w-full sm:w-3/6 md:w-1/3 `}
        >
          <SideSection />
        </div>

        <div className="hidden md:block fixed left-1/3 w-[1px] h-full z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-info/40 group-hover:via-primary transition-all duration-500"></div>
          <div className="absolute top-1/2 -left-[3px] w-[9px] h-[60px] rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 transform -translate-y-1/2"></div>
        </div>

        <div
          className={`${
            showSidebar &&
            "z-0 hidden [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-scroll"
          } md:absolute right-0 w-full sm:w-3/6 md:w-2/3 bg-gradient-to-t from-transparent via-primary/10 to-info/10 overflow-x-hidden`}
        >
          <Outlet />
        </div>
      </div>
      <vr />
    </>
  );
};

export default Main;
