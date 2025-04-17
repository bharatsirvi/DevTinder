import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";
import { removeUser } from "../utils/slices/userSlice";
import { setInitialSetup, setShowSidebar } from "../utils/slices/configSlice";
import { Code } from "lucide-react";
const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  const unseenCounts = useSelector((store) => store.unseenCounts || {});
  const requests = useSelector((store) => store.requests || []);
  const { showSidebar } = useSelector((store) => store.config);

  const totalNotifications = requests.length;

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogoutClick = async () => {
    try {
      await axios.post(
        BACKEND_BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      dispatch(setInitialSetup(false));
      dispatch(showSidebar(false));
      navigate("/login");
    } catch (error) {
      return ErrorPage;
    }
  };

  const handleToggleSidebar = () => {
    dispatch(setShowSidebar(!showSidebar));
  };

  return (
    <div className="navbar flex justify-between z-50 top-0 fixed backdrop-blur-md bg-gradient-to-l from-secondary/10 via-primary/10 to-info/10  shadow-xs px-6 md:px-8 shadow-base-content/30 bg-base-100">
      <div>
        <Link
          to="/"
          className=" cursor-pointer text-secondary text-xl font-bold"
        >
          <div className="flex gap-2 items-center">
            <Code size={24} className="text-secondary" />

            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-secondary to-info bg-clip-text text-transparent">
              DevTinder
            </h1>
          </div>
          {/* <img className="w-32 md:w-40" src={logo} alt="Logo" /> */}
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        {user && (
          <div>
            <Link
              to="/"
              className="relative hidden md:flex items-center group px-4 h-10 rounded-lg transition-all duration-200 hover:bg-pink-500/10"
            >
              {/* Floating bubble effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="absolute -inset-2 bg-info/5 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>
              </div>

              {/* Modern radar-style icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500 group-hover:text-pink-400 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 0 0-7.38 16.73" />
                <path d="M12 2a10 10 0 0 1 7.38 16.73" />
                <path d="M8 12a4 4 0 0 1 8 0" />
                <circle cx="12" cy="12" r="2" />
              </svg>

              {/* Text with sliding underline */}
              <span className="ml-2 font-medium bg-gradient-to-r from-pink-500 to-base-content bg-clip-text text-transparent dark:group-hover:text-secondary transition-colors">
                Explore
                <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

            <button
              onClick={handleToggleSidebar}
              className="relative group md:hidden"
              aria-label="Toggle sidebar"
            >
              <div
                className={`
      p-2 rounded-lg transition-all duration-300 ease-in-out
      ${
        showSidebar
          ? "bg-secondary/20 text-secondary shadow-xs shadow-secondary/20"
          : "bg-neatral-300 shadow-xs text-secondary hover:bg-base-300 shadow-secondary/20"
      }
      flex items-center justify-center
    `}
              >
                <div className="relative">
                  {/* Connection/Friends Icon - More realistic style */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* People/Users Icon */}
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>

                  {/* Notification Badge */}
                  {totalNotifications > 0 && (
                    <span className="absolute -top-3 -right-3 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary/80 text-white text-xs font-bold items-center justify-center">
                        {totalNotifications > 9 ? "9+" : totalNotifications}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Ripple effect on hover */}
              <span
                className={`
      absolute inset-0 rounded-lg scale-0 transition-transform duration-300
      group-hover:scale-100 group-hover:bg-secondary/10
    `}
              ></span>
            </button>
          </div>
        )}

        <label className="swap swap-rotate" onClick={toggleTheme}>
          {theme === "light" ? (
            <svg
              className="fill-current w-6 h-6 text-pink-500 hover:text-pink-400 transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
          ) : (
            <svg
              className="fill-current w-6 h-6 text-pink-500 hover:text-pink-400  transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          )}
        </label>

        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative group items-center gap-2">
              <span className="text-md font-medium bg-gradient-to-r from-pink-500 to-base-content bg-clip-text text-transparent uppercase">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="dropdown dropdown-end">
              <button className="group flex items-center justify-center rounded-full border-2 border-secondary/20 hover:border-secondary/50 transition-all duration-300 p-0.5 focus:outline-none focus:ring-2 focus:ring-secondary/30">
                <div className="relative rounded-full overflow-hidden h-8 w-8">
                  <img
                    src={user.photoUrl}
                    alt="Profile"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm bg-base-100 rounded-box w-52 p-2 shadow-lg z-50 mt-3 border border-base-300"
              >
                <div className="px-4 py-3 border-b border-base-300">
                  <p className="text-xs text-base-content/60">Signed in as</p>
                  <p className="text-sm font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-300 active:bg-base-300 transition-colors"
                    onClick={() => document.activeElement.blur()} // Close dropdown
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Your Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-300 active:bg-base-300 transition-colors"
                    onClick={() => document.activeElement.blur()} // Close dropdown
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Explore
                  </Link>
                </li>

                <li className="border-t border-base-300 mt-1">
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      document.activeElement.blur(); // Close dropdown
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 active:bg-error/10 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
