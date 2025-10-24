import { toast } from "react-toastify";
import { Loadmusics, Loadplaylists, SetLoading } from "../reducers/MusicSlice";
import axios from "axios";

const baseUrl = "http://localhost:3002/api/music";

// ✅ Load all music
export const asyncLoadMusic = () => async (dispatch) => {
  try {
    dispatch(SetLoading(true));
    const { data } = await axios.get(`${baseUrl}/`, { withCredentials: true });
    dispatch(Loadmusics(data.musicDocs || []));
    dispatch(SetLoading(false));
  } catch (error) {
    toast.error(error.message || "Failed to load music");
    dispatch(SetLoading(false));
  }
};
export const asyncgetOneMusic = (id) => async () => {
  try {
    const data = await axios.get(`${baseUrl}/getMusic/${id}`, {
      withCredentials: true,
    });

    // toast.success("Music fetched successfully!");
    return data; // actual music object
  } catch (error) {
    console.error("Fetch music error:", error);
    toast.error(
      error.response?.data?.message || error.message || "Failed to fetch music"
    );
  }
};

export const asyncgetallplaylist = () => async (dispatch) => {
  try {
    dispatch(SetLoading(true));
    const { data } = await axios.get(`${baseUrl}/getplaylist`, {
      withCredentials: true,
    });
    dispatch(Loadplaylists(data.playlist || []));
    dispatch(SetLoading(false));
  } catch (error) {
    toast.error(error.message || "Failed to load playlist");
    dispatch(SetLoading(false));
  }
};
export const asyncGetPlaylistById = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${baseUrl}/playlist/${id}`, {
      withCredentials: true,
    });
    return data.playlist;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch playlist");
    return null;
  }
};

// ✅ Get one music by ID
