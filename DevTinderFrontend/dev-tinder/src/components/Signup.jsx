import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../utils/constants";
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  if (user) navigate("/");
  const handleLoginClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BACKEND_BASE_URL + "/signup",
        {
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          emailId: emailRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      );
      const userData = response.data.data;
      dispatch(addUser(userData));
      navigate("/");
      console.log("siguup +", userData);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center my-20 mx-10">
      <div className="card relative bg-base-300 w-96 shadow-sm">
        <div className=" card-body gap-4 px-6 md:px-10">
          <h2 className="card-title mb-2 text-2xl justify-center">Sign Up</h2>
          <div className="flex flex-row md:flex-col gap-4 ">
            <input
              ref={firstNameRef}
              className="input validator w-full"
              type="text"
              maxLength={20}
              placeholder="First Name"
            />
            <input
              ref={lastNameRef}
              className="input validator w-full"
              type="text"
              maxLength={20}
              placeholder="Last Name"
            />
          </div>

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
            <span>Signup</span>
          </button>
          <p>
            I have already an account?{" "}
            <Link className="text-info" to="/login">
              {" "}
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
