import { toast } from "react-toastify";
import { Loaduser, removeuser } from "../reducers/Userslic";
import axios from "axios";

const BASE_URL = "https://betaly-music-player.onrender.com/api/auth";

export const asyncCurrentUser = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/me`, {
      withCredentials: true,
    });
    // console.log("Current User Data:", data);

    dispatch(Loaduser(data.user));
  } catch (error) {
    // No active user
  }
};

export const asyncLogoutuser = (navigate) => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    dispatch(removeuser());
    navigate("/");
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error(error.message);
  }
};

export const asyncLoginDetails = (user, navigate) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/login`, user, {
      withCredentials: true,
    });

    if (data) {
      setTimeout(() => {
        dispatch(asyncCurrentUser());
      }, 200);
      dispatch(Loaduser(data.user || data));
      navigate("/");
      toast.success("Login Successful!");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid credentials");
  }
};

export const asyncRegisterUser = (user) => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/register`, user, { withCredentials: true });

    setTimeout(() => {
      dispatch(asyncCurrentUser());
    }, 200);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Something went wrong during registration"
    );
  }
};
