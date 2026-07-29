const express = require("express");
const router = express.Router();

const {
  getMyReels,
  createReel,
  deleteReel,
  updateFavorite,
  updateDuration,
} = require("../controllers/reelController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMyReels);
router.post("/", authMiddleware, createReel);
router.patch("/:id/favorite", authMiddleware, updateFavorite);
router.patch("/:id/duration", authMiddleware, updateDuration);
router.delete("/:id", authMiddleware, deleteReel);

module.exports = router;
