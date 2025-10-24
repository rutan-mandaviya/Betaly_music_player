import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Music, Star, Play } from "lucide-react";
import { asyncGetPlaylists } from "../store/actions/ArtistAction";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const artistMusics = useSelector(
    (state) => state.artistReducer.artistMusics || []
  );
  const playlists = useSelector((state) => state.artistReducer.playlists || []);
  console.log("artist playlist :", artistMusics);
  console.log("playlist :", playlists);

  useEffect(() => {
    dispatch(asyncGetPlaylists());
  }, []);

  if (!user) return <div className="p-6 text-center">No user data found!</div>;

  return (
    <div className="min-h-screen bg-lime-50 p-6">
      {/* Profile Header */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <img
            src={user.profileImage || "/logo.png"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-contain border-2 border-lime-500"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              {user.fullname.firstname} {user.fullname.lastname}{" "}
              {user.role === "artist" && <Star className="text-yellow-400" />}
            </h1>
            <p className="text-gray-600 text-lg">{user.email}</p>
            {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          </div>

          {/* Stats */}
          {user.role === "artist" && (
            <div className="flex gap-6 mt-4">
              <div className="flex flex-col items-center">
                <Music size={24} className="text-lime-500" />
                <span className="font-semibold">{artistMusics.length}</span>
                <span className="text-gray-500 text-sm">Songs</span>
              </div>
              <div className="flex flex-col items-center">
                <Music size={24} className="text-lime-500" />
                <span className="font-semibold">{playlists.length}</span>
                <span className="text-gray-500 text-sm">Playlists</span>
              </div>
              <div className="flex flex-col items-center">
                <User size={24} className="text-lime-500" />
                <span className="font-semibold">{user.followers || 0}</span>
                <span className="text-gray-500 text-sm">Followers</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playlists Section */}

      {/* Artist Music Section */}
      {user.role === "artist" && artistMusics.length > 0 && (
        <div className="max-w-5xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {artistMusics.map((music) => (
              <div
                key={music.id}
                className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={music.coverImageKey || "/default-cover.png"}
                  alt={music.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-gray-800">{music.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {music.genre || "Unknown Genre"}
                  </p>
                </div>
                <button className="bg-lime-500 p-2 rounded-full text-white hover:bg-lime-600 transition">
                  <Play size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
