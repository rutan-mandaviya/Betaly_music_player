import { createSlice } from "@reduxjs/toolkit";

const MusicSlice = createSlice({
  name: "music",
  initialState: {
    musics: [],
    playlists: [],
    loading: false,
  },
  reducers: {
    Loadmusics: (state, action) => {
      state.musics = action.payload;
      state.loading = false;
    },
    Loadplaylists: (state, action) => {
      state.playlists = action.payload;
      state.loading = false;
    },

    SetLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { Loadplaylists, Loadmusics, SetLoading } = MusicSlice.actions;
export default MusicSlice.reducer;
