const path = require("path");
const authRouter = require("./routes/auth");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const importRouter = require("./routes/import");
const connectDB = require("./config/db");

// Load environment variables from the local .env file when present.
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for the frontend and parse incoming JSON payloads.
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
      `🚀 Reelo audio backend listening on http://localhost:${PORT}`
    );
  });
};

startServer();
