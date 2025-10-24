import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayCircle } from "lucide-react";
import {
  asyncGetArtistMusics,
  asyncGetPlaylists,
} from "../store/actions/ArtistAction";
import { Link, useNavigate } from "react-router-dom";
import {
  asyncgetallplaylist,
  asyncLoadMusic,
} from "../store/actions/MusicAction";

const Home = () => {
  const dispatch = useDispatch();
  const musics = useSelector((state) => state.musicReducer.musics);
  const playlists = useSelector((state) => state.musicReducer.playlists);
  const user = useSelector((state) => state.userReducer.user);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(asyncLoadMusic());
    dispatch(asyncgetallplaylist());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-lime-50 to-gray-20 text-gray-900 p-6 lg:px-30 py-8">
      {/* Featured Playlists */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">🎵 Featured Playlists</h2>
          <button className="text-sm text-gray-500 hover:underline">
            See All
          </button>
        </div>
        <div className="playlistscrooler flex gap-5 overflow-x-auto pb-4 px-2   ">
          {playlists.map((p) => {
            const cover =
              p.musics?.[0]?.coverImageKey ||
              "https://placehold.co/200x200/EEE/333?text=No+Cover";

            return (
              <div
                key={p._id}
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate(`/playlist/${p._id}`);
                }}
                className="group flex-shrink-0 flex items-center bg-white border border-lime-300 rounded-2xl shadow-md hover:shadow-xl  transition-all duration-300 w-72 sm:w-80 snap-start relative overflow-hidden"
              >
                {/* Left Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={cover}
                    alt={p.title}
                    className="w-28 h-28 object-cover rounded-l-2xl"
                  />

                  {/* Hover Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <PlayCircle
                      size={32}
                      className="text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Right Details */}
                <div className="flex flex-col justify-center px-4 py-2 w-full">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {p.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">@{p.artist}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {p.musics?.length || 0} Tracks
                  </p>

                  {/* Subtle tag or category */}
                  <div className="mt-2 text-[10px] text-lime-700 bg-lime-100 px-2 py-1 rounded-full w-fit">
                    Playlist
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-lime-100/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Musics */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">🎧 Latest Tracks</h2>
          <button className="text-sm text-gray-500 hover:underline">
            See All
          </button>
        </div>
        <div className="playlistscrooler flex gap-4 overflow-x-auto pb-2">
          {musics
            ?.slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((m) => (
              <div
                key={m._id}
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate(`/musics/${m._id}`);
                }}
                className="flex-shrink-0 w-36 bg-white border border-lime-300 rounded-xl shadow hover:shadow-lg transition cursor-pointer relative"
              >
                <img
                  src={m.coverImageKey}
                  alt={m.title}
                  className="w-full h-36 object-cover rounded-t-xl"
                />
                <div className="absolute inset-0 bg-black/10 flex justify-center items-center opacity-0 hover:opacity-100 hover:rounded-xl transition-opacity">
                  <PlayCircle size={32} className="text-white" />
                </div>
                <div className="p-2 text-center">
                  <h4 className="text-sm font-medium truncate">{m.title}</h4>
                  <p className="text-xs text-gray-500">@{m.artist}</p>
                  {/* <p className="text-xs text-gray-500 truncate">{m.Genre}</p> */}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
