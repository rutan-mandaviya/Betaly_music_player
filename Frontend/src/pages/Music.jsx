import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { asyncgetOneMusic, asyncLoadMusic } from "../store/actions/MusicAction";
import {
  Play,
  Pause,
  Heart,
  Volume2,
  SkipForward,
  SkipBack,
} from "lucide-react";

const Music = () => {
  const { musicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [musicData, setMusicData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);
  console.log("progress", progress);

  const allmusics = useSelector((state) => state.musicReducer.musics);

  useEffect(() => {
    const fetchMusic = async () => {
      const music = await dispatch(asyncgetOneMusic(musicId));
      setMusicData(music.data.musicbyid);
      //   setProgress(0);
      //   setIsPlaying(false);
    };
    fetchMusic();
    dispatch(asyncLoadMusic());
  }, [dispatch, musicId]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progress =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value / 100;
  };

  const playNext = () => {
    const currentIndex = allmusics.findIndex((m) => m._id === musicId);
    const nextIndex = (currentIndex + 1) % allmusics.length;
    const nextSong = allmusics[nextIndex];
    navigate(`/musics/${nextSong._id}`);
    // setProgress(0);
  };

  const playPrev = () => {
    const currentIndex = allmusics.findIndex((m) => m._id === musicId);
    const prevIndex = (currentIndex - 1 + allmusics.length) % allmusics.length;
    const prevSong = allmusics[prevIndex];
    navigate(`/musics/${prevSong._id}`);
    // setProgress(0);
  };

  //   useEffect(() => {
  //     playNext();
  //     playPrev();
  //   }, []);

  if (!musicData)
    return <div className="text-center text-gray-500 mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-lime-100 to-gray-200 flex flex-col items-center justify-start py-6 px-3">
      {/* Header */}
      <div className="flex justify-between w-full max-w-4xl items-center mb-6">
        <div className="text-lg font-semibold text-gray-800">
          🎧 Beatly Music Player
        </div>
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="User"
            className="w-8.5 h-9 object-cover rounded-full"
          />
        </div>
      </div>

      {/* Player Section */}
      <div className=" rounded-3xl flex flex-col md:flex-row gap-6 max-w-4xl w-full p-6">
        {/* Album Art */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <img
            src={
              musicData.coverImageKey ||
              "https://placehold.co/260x260?text=No+Cover"
            }
            alt={musicData.title}
            className="w-64 h-64 rounded-2xl object-cover shadow-lg"
          />
          <div className="flex items-center justify-center gap-5 mt-4 pl-4">
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

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {musicData.title}
          </h1>
          <p className="text-gray-600 text-base">@{musicData.artist}</p>
          <p className="text-gray-500 text-sm mb-2">
            {musicData.album || "Beatly Album"} • 2026
          </p>

          <div className="flex items-center gap-1 mb-4">
            <span className="text-lg font-semibold text-gray-900">4.5</span>
            <span className="text-yellow-400 text-base">★★★★★</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
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
                {audioRef.current && audioRef.current.duration
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
        <audio
          ref={audioRef}
          src={musicData.musicKey}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          onLoadedMetadata={() => {
            setProgress(0);
            audioRef.current.currentTime = 0;
            if (isPlaying) audioRef.current.play(); // Auto play next song
          }}
        />
      </div>

      {/* Recommended Songs */}
      <div className="max-w-4xl w-full mt-8">
        <h2 className="text-xl font-bold mb-3 text-gray-800">Recommended</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allmusics
            ?.filter((m) => m._id !== musicId)
            .slice(0, 4)
            .map((rec) => (
              <div
                key={rec._id}
                onClick={() => navigate(`/musics/${rec._id}`)}
                className="bg-green-50 rounded-2xl p-1 shadow hover:shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={
                    rec.coverImageKey ||
                    "https://placehold.co/200x200?text=No+Cover"
                  }
                  alt={rec.title}
                  className="w-full h-32 rounded-xl object-cover mb-2"
                />
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {rec.title}
                </h3>
                <p className="text-gray-500 text-xs">{rec.artist}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
