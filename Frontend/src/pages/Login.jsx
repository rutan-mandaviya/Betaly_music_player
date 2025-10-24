import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Eye, EyeOff, X, Smile, Star } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  asyncLoginDetails,
  asyncRegisterUser,
} from "../store/actions/UserAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate(); // <-- add this
  const handleClose = () => {
    if (onClose) onClose(); // popup
    else navigate("/", { replace: true }); // route fallback
  };

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const payload = {
          email: data.email,
          password: data.password,
        };
        dispatch(asyncLoginDetails(payload, navigate));
        // await axios.get("");
        console.log("Login payload:", payload);
      } else {
        const payload = {
          email: data.email,
          password: data.password,
          fullname: {
            firstname: data.firstName,
            lastname: data.lastName,
          },
          role: data.role,
        };
        dispatch(asyncRegisterUser(payload));
        console.log("Register payload:", payload);
        toast.success("Registration Successful!");
      }
      reset();
      onClose();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-lime-50 w-96 p-6 rounded-2xl shadow-2xl text-center relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black transition"
        >
          <X size={30} />
        </button>

        {/* Logo */}
        <img
          className="mx-auto mb-5 mix-blend-multiply h-20"
          src="/logo.png"
          alt="logo"
        />

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center justify-center gap-2">
          {isLogin ? (
            <>
              Welcome back to <span className="text-lime-600">Beatly</span> 🎵
            </>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">
              Join the <span className="text-lime-600">Beatly</span> Family 🎧
              <span className="block text-sm font-medium text-gray-600">
                Create your account and vibe with us.
              </span>
            </h1>
          )}
        </h2>

        {/* Google Button */}
        <button
          onClick={() => {
            window.location.href =
              "https://betaly-music-player-frontend.onrender.com/api/auth/google";
          }}
          className="flex items-center justify-center gap-2 border border-gray-300 bg-lime-50 hover:bg-gray-100 text-gray-700 font-medium py-2 w-full rounded-md shadow-sm transition mb-4"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm mx-2">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-3 text-left"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!isLogin && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center border border-gray-300 rounded-md px-3 flex-1">
                <User size={18} className="text-gray-500 mr-2" />
                <input
                  className="p-2 w-full outline-none text-lime-700"
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
              </div>

              <div className="flex items-center border border-gray-300 rounded-md px-3 flex-1">
                <User size={18} className="text-gray-500 mr-2" />
                <input
                  className="p-2 w-full outline-none text-lime-700"
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-2">
              <label className="text-gray-500 mr-2">Role:</label>
              <select
                className="p-2 w-full outline-none text-gray-700"
                {...register("role", { required: "Role is required" })}
                defaultValue="user"
              >
                <option value="user">User</option>
                <option value="artist">Artist</option>
              </select>
            </div>
          )}

          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Mail size={18} className="text-gray-500 mr-2" />
            <input
              className="p-2 w-full outline-none text-lime-700"
              type="email"
              placeholder="email@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Lock size={18} className="text-gray-500 mr-2" />
            <input
              className="p-2 w-full outline-none text-lime-700"
              type={showPassword ? "text" : "password"}
              placeholder="******"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-black transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-lime-500 hover:bg-green-600 transition-all px-4 py-2 w-full text-white font-semibold rounded-md mt-2"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Switch Login/Register */}
        <p className="mt-3 text-sm text-gray-600 text-center">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <span
            className="text-teal-500 font-semibold cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
