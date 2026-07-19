const express = require("express");
const router = express.Router();

const {
  createPlaylist,
  getMyPlaylists,
  deletePlaylist,
} = require("../controllers/playlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createPlaylist);
router.get("/", authMiddleware, getMyPlaylists);
router.delete("/:id", authMiddleware, deletePlaylist);

module.exports = router;