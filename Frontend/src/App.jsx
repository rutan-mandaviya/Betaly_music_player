import React from "react";
import Nav from "./Components/Nav";
import Allroutes from "./routes/Allroutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  asyncGetArtistMusics,
  asyncGetPlaylists,
} from "./store/actions/ArtistAction";
import { asyncLoadMusic } from "./store/actions/MusicAction";
import { asyncCurrentUser } from "./store/actions/UserAction";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  console.log("user", user);

  useEffect(() => {
    dispatch(asyncGetArtistMusics());
    dispatch(asyncGetPlaylists());

    dispatch(asyncLoadMusic());
    dispatch(asyncCurrentUser());
  }, []);

  return (
    <div className="pt-20 ">
      <Nav></Nav>
      <Allroutes></Allroutes>
    </div>
  );
};

export default App;
