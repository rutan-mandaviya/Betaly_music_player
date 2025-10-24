import { configureStore } from "@reduxjs/toolkit";
import Userslice from "./reducers/Userslic";
import MusicSlice from "./reducers/MusicSlice";
import ArtistSlice from "./reducers/ArtistSlice";

export const store = configureStore({
  reducer: {
    userReducer: Userslice,
    musicReducer: MusicSlice,
    artistReducer: ArtistSlice,
  },
});
