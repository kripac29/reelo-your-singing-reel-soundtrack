const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    artist: {
      type: String,
      default: "",
    },

    cover: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      required: true,
    },

    sourceUrl: {
      type: String,
      required: true,
    },

    folderId: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "0:45",
    },

    mood: {
      type: String,
      default: "",
    },

    durationSeconds: {
      type: Number,
      default: 45,
    },

    savedAt: {
      type: String,
      default: "just now",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reel", reelSchema);
