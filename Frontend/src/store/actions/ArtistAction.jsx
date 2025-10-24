import axios from "axios";
import { toast } from "react-toastify";
import {
  LoadartistMusic,
  LoadPlaylists,
  SetLoading,
} from "../reducers/ArtistSlice";

const baseUrl = "https://betaly-music-player-1.onrender.com/api/music";
// backend base route

// 🎵 1️⃣ Get All Music Uploaded by This Artist
export const asyncGetArtistMusics = () => async (dispatch) => {
  try {
    dispatch(SetLoading(true));

    const { data } = await axios.get(`${baseUrl}/artist-musics`, {
      withCredentials: true,
    });

    dispatch(LoadartistMusic(data.musics || []));
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to fetch artist music"
    );
  } finally {
    dispatch(SetLoading(false));
  }
};

// 🎧 2️⃣ Upload New Music
export const asyncUploadMusic = (formData) => async (dispatch) => {
  try {
    dispatch(SetLoading(true));

    const { data } = await axios.post(`${baseUrl}/upload`, formData, {
      withCredentials: true,
    });

    toast.success(data.message || "Music uploaded successfully 🚀");
    // Optionally refetch updated artist music list
    dispatch(asyncGetArtistMusics());
  } catch (error) {
    toast.error(error.response?.data?.message || "Music upload failed");
  } finally {
    dispatch(SetLoading(false));
  }
};

// 🎶 3️⃣ Create a Playlist
export const asyncCreatePlaylist = (playlistData) => async (dispatch) => {
  try {
    dispatch(SetLoading(true));

    const { data } = await axios.post(
      `${baseUrl}/create-playlist`,
      playlistData,
      { withCredentials: true }
    );

    toast.success(data.message || "Playlist created successfully 🎧");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create playlist");
  } finally {
    dispatch(SetLoading(false));
  }
};

// 🎼 4️⃣ Get All Playlists of This Artist
export const asyncGetPlaylists = () => async (dispatch) => {
  try {
    dispatch(SetLoading(true));

    const { data } = await axios.get(`${baseUrl}/playlist`, {
      withCredentials: true,
    });

    dispatch(LoadPlaylists(data.playlist || [])); // ✅ load into redux
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load playlists");
  } finally {
    dispatch(SetLoading(false));
  }
};

// 🎤 5️⃣ Get a Playlist by ID (with its Music)
