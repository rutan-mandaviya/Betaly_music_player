import express from "express";
import multer from "multer";
import * as musicControlleroller from "../controller/music.controller.js";
import {
  authArtistMiddleware,
  userMiddleware,
} from "../middleware/music.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
});

router.post(
  "/upload",
  authArtistMiddleware,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  musicControlleroller.uploadMusic
);
router.get("/getMusic/:id", musicControlleroller.getMusicById);
router.get("/", musicControlleroller.getallMusic);

// artist router

router.get(
  "/artist-musics",
  authArtistMiddleware,
  musicControlleroller.getArtistMusic
);
router.get("/getplaylist", musicControlleroller.getallplaylist);
// playlist routers
router.post(
  "/create-playlist",
  authArtistMiddleware,
  musicControlleroller.createPlaylist
);
router.get("/playlist/:id", musicControlleroller.getPlaylistById);
router.get("/playlist", authArtistMiddleware, musicControlleroller.getPlaylist);
export default router;
