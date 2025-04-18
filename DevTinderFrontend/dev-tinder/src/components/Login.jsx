import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../utils/constants";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../utils/firebase";

import {
  Heart,
  MessageSquare,
  Users,
  Mail,
  Lock,
  LogIn,
  ChevronRight,
  Sparkles,
  Smile,
  Laugh,
  Code,
} from "lucide-react";

const FunFacts = [
  "82% of friendships here start with a meme exchange",
  "Average user makes 3 new connections weekly",
  "Most popular icebreaker: 'What's your go-to karaoke song?'",
  "Top shared interest: Binge-watching shows while pretending to work",
  "Best feature according to users: The 'Send Pizza' button in DMs",
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [funFact, setFunFact] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const auth = getAuth(app);

  useEffect(() => {
    if (user) {
      if (user?.photoUrl) navigate("/");
      else navigate("/signup/setup");
    }
    setFunFact(FunFacts[Math.floor(Math.random() * FunFacts.length)]);
  }, [user]);

  const handleLoginClick = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        BACKEND_BASE_URL + "/login",
        {
          emailId: emailRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      );
      dispatch(addUser(response.data.data));
      navigate("/");
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Oops! Let's try that again"
      );
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(
        BACKEND_BASE_URL + "/login/google",
        { idToken },
        { withCredentials: true }
      );

      dispatch(addUser(response.data.data));
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg(
        error?.response?.data?.message ||
          "Google login failed. Please try again."
      );
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen md:fixed md:left-0 md:right-0 md:top-10 md:bottom-0  flex items-center justify-center bg-gradient-to-l from-secondary/10 via-primary/10 to-info/10 p-4 ">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-base-100 rounded-2xl overflow-hidden shadow-2xl border border-base-300">
        {/* Vibrant Left Section */}
        <div className="hidden md:block lg:w-1/2 p-10 text-white bg-gradient-to-br from-info via-primary to-secondary">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
                  <Code className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">DevTinder</h1>
                  <p className="text-lg opacity-90">Where tech meets fun</p>
                </div>
              </div>

              <div className="badge badge-outline border-white/30 text-white gap-2 p-4 mb-6">
                <Sparkles size={16} /> Make real connections
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Laugh className="mr-3" size={24} />
                Why you'll love it
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <MessageSquare className="mb-3" size={28} />
                  <h4 className="font-bold mb-2">Chat Freely</h4>
                  <p className="text-sm opacity-90">
                    No tech talk required (unless you want to)
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Users className="mb-3" size={28} />
                  <h4 className="font-bold mb-2">Find Your Tribe</h4>
                  <p className="text-sm opacity-90">
                    People who get your weird humor
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl border-l-4 border-white">
                <p className="italic mb-2">"{funFact}"</p>
                <p className="text-xs opacity-70 text-right">
                  — DevTinder Fact
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Right Section */}
        <div className="lg:w-1/2 bg-base-100 p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="flex flex-col items-center mb-10 lg:hidden">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-info text-white rounded-full mb-4">
                <Code size={28} />
              </div>
              <h1 className="text-3xl font-bold mb-2">DevTinder</h1>
              <p className="text-sm opacity-70">Login to find your people</p>
            </div>

            <h2 className="text-3xl font-bold mb-8 text-center lg:text-left">
              Welcome Back
            </h2>

            <div className="space-y-6">
              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text">Email</span>
                  <span>
                    <Mail size={18} />
                  </span>
                </label>
                <label className="input-group">
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="your@email.com"
                    className="input input-bordered w-full focus:ring-2 focus:ring-secondary"
                  />
                </label>
              </div>

              <div className="form-control relative">
                <label className="label mb-1">
                  <span className="label-text">Password</span>
                  <span>
                    <Lock size={16} />
                  </span>
                </label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type={showPassword ? "password" : "text"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pr-10"
                    minLength="8"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {errorMsg && (
                <div className="text-error">
                  <div>
                    <span>😅 {errorMsg}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLoginClick}
                disabled={loading}
                className="btn btn-secondary w-full mt-6 hover:scale-[1.02] transition-transform"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Let's Go!
                  </>
                )}
              </button>

              <div className="divider hidden md:flex">OR</div>
              {/* Google Signup Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="btn btn-outline w-full my-6 hover:bg-gray-100 transition-all"
              >
                {googleLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Login with Google
                  </>
                )}
              </button>
              <div className="text-center">
                <p className="text-sm opacity-70">
                  New here?{" "}
                  <Link
                    to="/signup"
                    className="link link-secondary font-semibold"
                  >
                    Join the fun <ChevronRight size={14} className="inline" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
