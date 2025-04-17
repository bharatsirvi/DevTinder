import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import ErrorPage from "./Error";
import { addRequest, addRequests } from "../utils/slices/requestsSlice";
import { createSocketConnection } from "../utils/socket";
import { addOnlineUsers } from "../utils/slices/onlineUsersSlice";
import {
  addUnseenCounts,
  incrementUnseenCount,
} from "../utils/slices/unseenCounts";
import { addConnection } from "../utils/slices/connectionsSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const location = useLocation();
  const fecthUser = async () => {
    try {
      const response = await axios.get(BACKEND_BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(response.data.data));
    } catch (error) {
      if (error.status == 401) return navigate("/login");
      else return <ErrorPage />;
    }
  };

  const fetchRequests = async () => {
    console.log("fetchrequest called");
    try {
      const response = await axios.get(
        BACKEND_BASE_URL + "/user/requests/received",
        {
          withCredentials: true,
        }
      );
      dispatch(addRequests(response.data.data));
    } catch (error) {
      if (error.status == 401) navigate("/login");
      console.log(error);
    }
  };

  useEffect(() => {
    fecthUser();
    fetchRequests();
    if (user) {
      if (user?.photoUrl) {
        if (location.pathname === "/profile") navigate("/profile");
        else navigate("/");
      } else navigate("/signup/setup");
    }
  }, [userId]);

  useEffect(() => {
    const socket = createSocketConnection();
    if (userId) {
      socket.connect();

      socket.emit("userOnline", userId);
      socket.emit("getUnseenMessageCounts", userId);
      socket.on("unseenMessageCounts", (unseenCounts) => {
        dispatch(addUnseenCounts(unseenCounts));
      });
      socket.on("newRequest", (data) => {
        console.log("New request received!", data);
        dispatch(addRequest(data));
      });
      socket.on("requestAccepted", (data) => {
        console.log("your request Accepted!", data);
        dispatch(addConnection(data));
      });
    }
    socket.on("updateOnlineUsers", (userList) => {
      dispatch(addOnlineUsers(userList));
    });

    socket.on("newMessageReceived", (data) => {
      const { from, to } = data;
      if (to.toString() === userId.toString())
        dispatch(incrementUnseenCount(from));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <>
      <div className="bg-gradient-to-b from-secondary/10 via-primary/10 to-info/10">
        <div className="bg-gradient-to-l from-secondary/10 via-primary/10 to-info/10 z-50">
          <Header />
        </div>
        <div className="mt-16">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Body;
