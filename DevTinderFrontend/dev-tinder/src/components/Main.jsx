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
  }, [location]);

  return (
    <>
      <div className="flex h-full justify-center">
        <div
          className={`${
            !showSidebar && "hidden md:block"
          } z-10 absolute md:relative w-full sm:w-3/6 md:w-1/3`}
        >
          <SideSection />
        </div>
        <div
          className={`${
            showSidebar && "z-0 hidden md:block fixed"
          }h-auto md:relative w-full sm:w-3/6 md:w-2/3`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Main;
