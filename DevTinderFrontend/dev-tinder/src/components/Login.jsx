import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../utils/constants";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  if (user) navigate("/");
  const handleLoginClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BACKEND_BASE_URL + "/login",
        {
          emailId: emailRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      );
      const userData = response.data.data;
      dispatch(addUser(userData));
      navigate("/");
      console.log("user data stored in store");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "something went wrong");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center my-20 mx-10 opacity-80">
        <div className="card relative bg-base-300 w-96 shadow-sm">
          <div className=" card-body gap-4 px-6 md:px-10">
            <h2 className="card-title mb-2 text-2xl justify-center">Login</h2>
            <input
              ref={emailRef}
              className="input validator w-full"
              type="email"
              placeholder="mail@site.com"
            />
            <input
              ref={passwordRef}
              type="password "
              className="input validator w-full"
              placeholder="Password"
              minLength="8"
            />
            <p className="text-error">{errorMsg}</p>
            <button
              onClick={handleLoginClick}
              className="btn flex gap-2 btn-secondary"
            >
              <span>Login</span>
            </button>
            <p>
              I have not an account?{" "}
              <Link className="text-info" to="/signup">
                {" "}
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
