const path = require("path");
const authRouter = require("./routes/auth");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const importRouter = require("./routes/import");
const connectDB = require("./config/db");
const playlistRouter = require("./routes/playlistRoutes");
const reelRouter = require("./routes/reelRoutes");

// Load environment variables from the local .env file when present.
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "https://reelo-your-singing-reel-soundtrack.vercel.app",
  ...(process.env.FRONTEND_ORIGINS || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (
        origin === "http://localhost:8080" ||
        origin === "http://localhost:8081"
      ) {
        return callback(null, true);
      }

      // Allow your production Vercel domain
      if (origin === "https://reelo-your-singing-reel-soundtrack.vercel.app") {
        return callback(null, true);
      }

      // Allow ALL Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Allow any additional origins from env variable
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Upload directories
const audioUploadsDir = path.join(__dirname, "..", "uploads", "audio");
const thumbnailUploadsDir = path.join(__dirname, "..", "uploads", "thumbnails");
fs.mkdirSync(audioUploadsDir, { recursive: true });
fs.mkdirSync(thumbnailUploadsDir, { recursive: true });

// Serve audio files
app.use(
  "/uploads/audio",
  express.static(audioUploadsDir, {
    setHeaders(res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
    },
  })
);

// Serve thumbnail files
app.use(
  "/uploads/thumbnails",
  express.static(thumbnailUploadsDir, {
    setHeaders(res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
    },
  })
);

// Existing import flow remains unchanged.
app.use("/api/import", importRouter);

// Authentication routes for OTP sign-up and login.
app.use("/api/auth", authRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/reels", reelRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
  });
});

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🚀 Reelo audio backend listening on port ${PORT}`
    );
  });
};

startServer();
