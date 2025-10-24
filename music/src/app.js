import express from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import _config from "./config/config.js";
import cors from "cors";
import musicRoutes from "./routes/music.route.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieparser());

app.get("/", (req, res) => {
  res.send("🎧 Beatly API is running!");
});

app.use("/api/music", musicRoutes);

export default app;
