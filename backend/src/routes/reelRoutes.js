const express = require("express");
const router = express.Router();

const {
  getMyReels,
  createReel,
  deleteReel,
} = require("../controllers/reelController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMyReels);
router.post("/", authMiddleware, createReel);
router.delete("/:id", authMiddleware, deleteReel);

module.exports = router;