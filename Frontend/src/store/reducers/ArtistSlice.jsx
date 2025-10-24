import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  artistMusics: [], // renamed for clarity
  playlists: [],
  loading: false,
};

const ArtistSlice = createSlice({
  name: "ArtistSlice",
  initialState,
  reducers: {
    // 🎵 Load all music of the artist
    LoadartistMusic: (state, action) => {
      state.artistMusics = action.payload;
    },
    // 🎶 Load all playlists of the artist
    LoadPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    // ⏳ Set loading spinner state
    SetLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { LoadartistMusic, LoadPlaylists, SetLoading } =
  ArtistSlice.actions;
export default ArtistSlice.reducer;
