import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Music,
  FolderPlus,
  PlayCircle,
  Heart,
  Upload,
  X,
  CheckCircle,
  ListPlus,
} from "lucide-react";
import { asyncUploadMusic } from "../store/actions/ArtistAction";
import { Link } from "react-router-dom";

// 🎵 Upload Music Modal Component
const UploadMusicModal = ({ isOpen, onClose, onUploaded }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAudio, setPreviewAudio] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    if (!data.music[0] || !data.coverImage[0]) {
      return toast.error("Music and cover image are required!");
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("Genre", data.Genre);
    formData.append("music", data.music[0]);
    formData.append("coverImage", data.coverImage[0]);

    setLoading(true);
    setProgress(0);
    setUploadDone(false);

    try {
      // Simulate progress (replace with axios onUploadProgress if backend supports)
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 5));
      }, 150);

      const res = await dispatch(asyncUploadMusic(formData));
      clearInterval(interval);
      setProgress(100);
      setUploadDone(true);

      onUploaded?.();
      reset();
      setPreviewAudio(null);
      setPreviewImage(null);

      setTimeout(() => {
        onClose();
        setUploadDone(false);
      }, 1200);
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload size={18} /> Upload Music
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-md mx-auto"
        >
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder="Music Title"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <input
            {...register("Genre", { required: true })}
            type="text"
            placeholder="Music Genre"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          {/* Music File Input + Preview */}
          <input
            {...register("music", { required: true })}
            type="file"
            accept="audio/*"
            className="border border-gray-300 rounded-lg p-2"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setPreviewAudio(URL.createObjectURL(file));
            }}
          />
          {previewAudio && (
            <audio
              controls
              src={previewAudio}
              className="rounded-lg border border-gray-200 p-2"
            />
          )}

          {/* Cover Image Input + Preview */}
          <input
            {...register("coverImage", { required: true })}
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded-lg p-2"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setPreviewImage(URL.createObjectURL(file));
            }}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
            />
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-lime-500 text-white rounded-lg py-2 font-semibold hover:bg-lime-600 transition-all disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {/* Progress Bar */}
          {loading && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                <div
                  className="bg-lime-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-1">
                {progress}%
              </p>
            </>
          )}

          {/* Success Check */}
          {uploadDone && (
            <div className="flex justify-center items-center mt-3 transition-all">
              <CheckCircle className="text-green-500" size={36} />
              <p className="ml-2 text-green-600 font-medium">
                Upload Complete!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const CreatePlaylistModal = ({ isOpen, onClose, onCreated }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const artistMusics = useSelector(
    (state) => state.artistReducer.artistMusics || []
  );

  const [selectedMusics, setSelectedMusics] = useState([]);

  const toggleMusicSelection = (id) => {
    setSelectedMusics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data) => {
    if (!data.title.trim()) return toast.error("Title is required!");
    if (selectedMusics.length === 0)
      return toast.error("Please select at least one track!");

    const payload = {
      title: data.title,
      musics: selectedMusics,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3002/api/music/create-playlist",
        payload,
        { withCredentials: true }
      );
      toast.success("✅ Playlist Created Successfully!");
      onCreated?.(res.data);
      reset();
      setSelectedMusics([]);
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "❌ Failed to create playlist"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ListPlus size={18} /> Create Playlist
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Playlist Title */}
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder="Playlist Title"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          {/* Music Selection */}
          <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
            {artistMusics.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No tracks available. Upload some first!
              </p>
            ) : (
              artistMusics.map((m) => (
                <label
                  key={m._id}
                  className="flex items-center gap-2 py-1 px-2 hover:bg-lime-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMusics.includes(m._id)}
                    onChange={() => toggleMusicSelection(m._id)}
                  />
                  <div className="flex items-center gap-2">
                    <img
                      src={m.coverImageKey}
                      alt={m.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-gray-500">{m.Genre}</p>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-lime-500 text-white rounded-lg py-2 font-semibold hover:bg-lime-600 transition-all disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
};

// export default CreatePlaylistModal;

// 🎤 Main Artist Dashboard
const ArtistDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const user = useSelector((state) => state.userReducer.user);
  console.log("user", user);

  const artistmusic = useSelector((state) => state.artistReducer.artistMusics)
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const playlist = useSelector((state) => state.artistReducer.playlists);

  const stats = [
    { icon: Music, label: "Musics", value: artistmusic.length },
    { icon: FolderPlus, label: "Playlists", value: playlist.length },
    { icon: PlayCircle, label: "Total Plays", value: "5.2K" },
    { icon: Heart, label: "Likes", value: "1.9K" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-lime-100 flex flex-col items-center py-10 px-4 text-gray-800">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0 px-4">
        {/* Greeting */}
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">
          <small>🎤 Hey, {user.fullname.firstname}</small>
        </h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => setPlaylistOpen(true)}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm bg-gradient-to-br from-white via-green-50 to-lime-100 border border-lime-400 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <ListPlus size={18} />
            Create Playlist
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm bg-gradient-to-br from-white via-lime-50 to-green-100 border border-lime-400 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <Upload size={18} />
            Upload Music
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mb-10">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 p-2 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all hover:bg-lime-50"
          >
            <item.icon className="text-lime-700 mb-2" size={22} />
            <h3 className="text-xs font-medium text-gray-600">{item.label}</h3>
            <p className="text-lg font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Uploaded Music */}
      <div className="w-fit max-w-4xl mb-6 sm:px-0 ">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
          <Music className="text-lime-600" size={18} /> Your Tracks
        </h2>
        <div
          id="artistmusicScroolbar"
          className="h-[42vh] overflow-x-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5"
        >
          {artistmusic
            ?.slice() // copy array to avoid mutating redux state
            .sort((a, b) => new Date(b.created) - new Date(a.created)) // newest first
            .map((n) => (
              <Link
                to={`/musics/${n._id}`}
                key={n._id}
                className="bg-white border border-gray-100 rounded-xl p-1 sm:p-2 shadow-sm hover:shadow-md hover:bg-lime-50 transition-all cursor-pointer"
              >
                <div className="w-full h-24 sm:h-36 rounded-lg mb-2 overflow-hidden relative">
                  <img
                    src={n.coverImageKey}
                    alt={n.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all flex justify-center items-center">
                    <PlayCircle
                      size={28}
                      className="text-white drop-shadow-md sm:text-[36px]"
                    />
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-semibold px-1 text-gray-900 truncate">
                  {n.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 px-1 truncate">
                  Genre: {n.Genre}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {/* Playlists */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FolderPlus className="text-lime-500" size={20} /> Your Playlists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {playlist.map((p) => {
            const firstMusic = p.musics?.[0];
            const coverImage =
              firstMusic?.coverImageKey ||
              "https://placehold.co/400x300/EEE/31343C?text=No+Cover";

            return (
              <Link
                to={`/playlist/${p._id}`}
                key={p._id}
                className="bg-white border border-gray-100 rounded-2xl cursor-pointer p-3 sm:p-1 shadow-sm hover:shadow-md hover:bg-lime-50 transition-all flex flex-col sm:flex-row gap-3"
              >
                <div className="w-full sm:w-32 h-28 sm:h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                  <img
                    src={coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 hover:bg-black/10 transition-all flex justify-center items-center">
                    <PlayCircle
                      size={28}
                      className="text-white drop-shadow-md sm:text-[34px]"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>{p.musics?.length || 0} Tracks</span>
                    <span>{p.totalPlays || "1.2K"} Plays</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Upload Music Modal */}
      <UploadMusicModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUploaded={() => {}}
      />
      <CreatePlaylistModal
        isOpen={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        onCreated={() => {}}
      />
    </div>
  );
};

export default ArtistDashboard;
