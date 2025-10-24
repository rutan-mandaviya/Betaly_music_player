import express from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import _config from "./config/config.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "https://betaly-music-player-frontend.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());
app.use(morgan("dev"));
app.use(passport.initialize());
app.get("/", (req, res) => {
  res.send("🎧 Beatly auth API is running!");
});
passport.use(
  new GoogleStrategy(
    {
      clientID: _config.CLIENT_ID,
      clientSecret: _config.CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refrshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
app.use("/api/auth", authRoutes);

export default app;
