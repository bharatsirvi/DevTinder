import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useNavigate, useParams } from "react-router-dom";
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
  const userData = useSelector((store) => store.user);
  const userId = userData?._id;

  const fecthUser = async () => {
    try {
      const response = await axios.get(BACKEND_BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(response.data.data));
    } catch (error) {
      console.log("body error", error);
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
    if (!userData) fecthUser();
    fetchRequests();
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
      <div>
        <Header />
        <div className="py-16 h-screen overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Body;
