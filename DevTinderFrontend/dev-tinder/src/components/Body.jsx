import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import ErrorPage from "./Error";
import { addRequests } from "../utils/slices/requestsSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
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
    try {
      const response = await axios.get(
        BACKEND_BASE_URL + "/user/requests/received",
        {
          withCredentials: true,
        }
      );
      console.log("requests => ", response);
      dispatch(addRequests(response.data.data));
    } catch (error) {
      if (error.status == 401) navigate("/login");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) fecthUser();
    fetchRequests();
  }, []);
  return (
    <>
      <div>
        <Header />
        <div className="py-16 h-full ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Body;
