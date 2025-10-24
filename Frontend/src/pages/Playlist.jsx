import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Heart,
  Volume2,
  SkipForward,
  SkipBack,
  PlayCircle,
} from "lucide-react";
import {
  asyncgetallplaylist,
  asyncGetPlaylistById,
} from "../store/actions/MusicAction";

const Playlist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [playlistData, setPlaylistData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const allPlaylists = useSelector((state) => state.musicReducer.playlists);

  // Fetch playlist and all playlists
  useEffect(() => {
    const fetchPlaylist = async () => {
      const res = await dispatch(asyncGetPlaylistById(playlistId));
      setPlaylistData(res);
      setCurrentTrackIndex(0); // reset when switching playlists
      setIsPlaying(false);
      setProgress(0);
    };
    fetchPlaylist();
    dispatch(asyncgetallplaylist());
  }, [dispatch, playlistId]);

  const currentTrack = playlistData?.musics?.[currentTrackIndex];

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return;
    const progress =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress || 0);
  };

  // Seek
  const handleSeek = (e) => {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return;
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Volume
  const handleVolume = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume / 100;
  };

  // Next / Prev
  const playNext = () => {
    if (!playlistData?.musics?.length) return;
    const nextIndex = (currentTrackIndex + 1) % playlistData.musics.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!playlistData?.musics?.length) return;
    const prevIndex =
      (currentTrackIndex - 1 + playlistData.musics.length) %
      playlistData.musics.length;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!playlistData)
    return <div className="text-center text-gray-500 mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-lime-100 to-gray-200 flex flex-col items-center justify-start py-6 px-3">
      {/* Header */}
      <div className="flex justify-between w-full max-w-4xl items-center mb-6">
        <div className="text-lg font-semibold text-gray-800">🎶 Playlist</div>
        <img
          src="/logo.png"
          alt="User"
          className="w-9 h-9 object-cover rounded-full"
        />
      </div>

      {/* Playlist Section */}
      <div className="rounded-3xl flex flex-col md:flex-row gap-6 max-w-4xl w-full p-6   backdrop-blur-md">
        {/* Dynamic Cover */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <img
            src={
              currentTrack?.coverImageKey ||
              playlistData.coverImageKey ||
              playlistData.musics?.[0]?.coverImageKey ||
              "https://placehold.co/260x260?text=No+Cover"
            }
            alt={playlistData.title}
            className="w-64 h-64 rounded-2xl object-cover shadow-lg transition-all duration-300"
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-4">
            <button
              onClick={playPrev}
              className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition"
            >
              <SkipBack size={22} />
            </button>

            <button
              onClick={togglePlay}
              className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={playNext}
              className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition"
            >
              <SkipForward size={22} />
            </button>

            <button onClick={() => setLiked(!liked)}>
              <Heart
                className={`${
                  liked ? "text-red-500" : "text-gray-600"
                } hover:scale-110 transition-transform`}
                size={24}
              />
            </button>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {playlistData.title}
          </h1>
          <p className="text-gray-600 text-base">@{playlistData.artist}</p>
          <p className="text-gray-500 text-sm mb-2">
            {playlistData.musics?.length || 0} Tracks • Playlist
          </p>

          {/* Current Track */}
          {currentTrack && (
            <div className="mt-4 mb-3 bg-lime-50 p-3 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-900 text-sm truncate">
                🎵 {currentTrack.title}
              </p>
              <p className="text-xs text-gray-600 truncate">
                @{currentTrack.artist || "Unknown Artist"}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="100"
              value={Number.isNaN(progress) ? 0 : progress}
              onChange={handleSeek}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {audioRef.current
                  ? new Date(audioRef.current.currentTime * 1000)
                      .toISOString()
                      .substring(14, 19)
                  : "00:00"}
              </span>
              <span>
                {audioRef.current && !isNaN(audioRef.current.duration)
                  ? new Date(audioRef.current.duration * 1000)
                      .toISOString()
                      .substring(14, 19)
                  : "00:00"}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-end mt-3 gap-2 text-gray-600">
            <Volume2 size={18} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolume}
              className="w-24 accent-black"
            />
          </div>
        </div>

        {/* Hidden Audio */}
        {currentTrack && (
          <audio
            ref={audioRef}
            src={currentTrack.musicKey}
            onTimeUpdate={handleTimeUpdate}
            onEnded={playNext}
            onLoadedMetadata={() => {
              setProgress(0);
              if (isPlaying) audioRef.current.play();
            }}
          />
        )}
      </div>

      {/* Tracklist */}
      <div className="max-w-4xl w-full mt-8">
        <h2 className="text-xl font-bold mb-3 text-gray-800">Tracks</h2>
        <div className="space-y-2">
          {playlistData.musics?.map((track, i) => (
            <div
              key={i}
              onClick={() => setCurrentTrackIndex(i)}
              className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                i === currentTrackIndex
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <PlayCircle size={20} />
                <div>
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p
                    className={`text-xs ${
                      i === currentTrackIndex
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    @{track.artist || "Unknown"}
                  </p>
                </div>
              </div>
              <span className="text-xs">{track.duration || "4:00"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Playlists */}
      <div className="max-w-4xl w-full mt-10">
        <h2 className="text-xl font-bold mb-3 text-gray-800">
          Recommended Playlists
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {allPlaylists
            ?.filter((pl) => pl._id !== playlistId)
            .slice(0, 5)
            .map((rec) => (
              <div
                key={rec._id}
                onClick={() => navigate(`/playlist/${rec._id}`)}
                className="flex items-center bg-white border border-lime-300 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer w-72 sm:w-80"
              >
                <img
                  src={
                    rec.musics?.[0]?.coverImageKey ||
                    "https://placehold.co/200x200/DDD/333?text=No+Cover"
                  }
                  alt={rec.title}
                  className="w-28 h-28 object-cover rounded-l-2xl"
                />
                <div className="p-3">
                  <h4 className="text-sm font-semibold truncate text-gray-900">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-gray-500">@{rec.artist}</p>
                  <p className="text-xs text-gray-400">
                    {rec.musics?.length || 0} Tracks
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
