import { uploadFileToSupabase } from "../services/storage.service.js";
import musicModel from "../model/music.model.js";
import playlistModel from "../model/playlist.model.js";

export async function uploadMusic(req, res) {
  try {
    const musicFile = req.files["music"]?.[0];
    const coverImage = req.files["coverImage"]?.[0];

    if (!musicFile || !coverImage) {
      return res.status(400).json({ message: "Music or cover image missing" });
    }

    // ⚡ Upload both in parallel
    const [musicUrl, coverUrl] = await Promise.all([
      uploadFileToSupabase(
        "music",
        musicFile.buffer,
        `music_${Date.now()}_${musicFile.originalname}`,
        musicFile.mimetype
      ),
      uploadFileToSupabase(
        "covers",
        coverImage.buffer,
        `cover_${Date.now()}_${coverImage.originalname}`,
        coverImage.mimetype
      ),
    ]);

    // ⚙️ Asynchronous DB insert (non-blocking)
    musicModel
      .create({
        title: req.body.title,
        artist: `${req.user.fullname.firstname} ${req.user.fullname.lastname}`,
        artistId: req.user.id,
        musicKey: musicUrl,
        coverImageKey: coverUrl,
        Genre: req.body.Genre,
      })
      .catch((err) => console.error("DB save failed:", err));

    // ⚡ Respond instantly to frontend
    return res.status(200).json({
      message: "Upload started 🚀",
      musicUrl,
      coverUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getArtistMusic(req, res) {
  try {
    const musics = await musicModel.find({ artistId: req.user.id });

    return res.status(200).json({
      message: "All music from this artist 🎶",
      musics,
    });
  } catch (error) {
    console.log("error while getArtistMusic", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function createPlaylist(req, res) {
  const { title, musics } = req.body;

  try {
    const playlist = await playlistModel.create({
      title,
      artist: req.user.fullname.firstname + " " + req.user.fullname.lastname,
      artistId: req.user.id,
      musics,
    });
    return res.status(201).json({
      message: "playlist Created SuccesFully!!",
      playlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error!!",
    });
  }
}

export async function getPlaylist(req, res) {
  try {
    const playlist = await playlistModel
      .find({ artistId: req.user.id })
      .populate("musics");
    return res.status(200).json({
      playlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error!!",
    });
  }
}

export async function getPlaylistById(req, res) {
  const { id } = req.params;
  try {
    const playlist = await playlistModel.findById(id);
    if (!playlist) {
      return res.status(404).json({
        message: "playlist not found!!",
      });
    }

    const musics = await musicModel.find({
      _id: { $in: playlist.musics },
    });

    // Step 3: send combined response
    return res.status(200).json({
      message: "Playlist fetched successfully!!",
      playlist: {
        ...playlist.toObject(),
        musics, // attach music details
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error!!",
    });
  }
}
export async function getallMusic(req, res) {
  const { skip = 0, limit = 10 } = req.query;
  try {
    const musicDocs = await musicModel.find().skip(skip).limit(limit);
    return res.status(200).json({
      message: "Music Fetch SuccesFully!!",
      musicDocs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error!!",
    });
  }
}
export async function getallplaylist(req, res) {
  const { skip = 0, limit = 10 } = req.query;
  try {
    const playlist = await playlistModel
      .find()
      .populate("musics")
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      message: "playlist Fetch SuccesFully!!",
      playlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error!!",
    });
  }
}
export async function getMusicById(req, res) {
  const { id } = req.params;
  try {
    const musicbyid = await musicModel.findById(id);
    if (!musicbyid)
      return res.status(200).json({ message: "music not found!!" });
    return res.status(200).json({
      message: "Music Fetch SuccesFully!!",
      musicbyid,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error!!",
    });
  }
}
