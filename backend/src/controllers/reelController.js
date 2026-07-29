const Reel = require("../models/Reel");

// GET /api/reels
const getMyReels = async (req, res) => {
  try {
    const reels = await Reel.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      reels,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch reels",
    });
  }
};

// POST /api/reels
const createReel = async (req, res) => {
  try {
    const { title, audioUrl, sourceUrl, folderId } = req.body;
    if (!title || !audioUrl || !sourceUrl || !folderId) {
      return res.status(400).json({
        success: false,
        message: "title, audioUrl, sourceUrl, and folderId are required",
      });
    }

    const reel = await Reel.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      reel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to save reel",
    });
  }
};

// DELETE /api/reels/:id
const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.json({
      success: true,
      message: "Reel deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to delete reel",
    });
  }
};

// PATCH /api/reels/:id/favorite
const updateFavorite = async (req, res) => {
  try {
    if (typeof req.body.isFavorite !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFavorite must be a boolean",
      });
    }

    const reel = await Reel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isFavorite: req.body.isFavorite },
      { new: true }
    );

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    return res.json({ success: true, reel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to update favorite",
    });
  }
};

// PATCH /api/reels/:id/duration
const updateDuration = async (req, res) => {
  try {
    const durationSeconds = Number(req.body.durationSeconds);
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      return res.status(400).json({
        success: false,
        message: "durationSeconds must be a positive number",
      });
    }

    const roundedDuration = Math.round(durationSeconds);
    const reel = await Reel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        durationSeconds: roundedDuration,
        duration: `${Math.floor(roundedDuration / 60)}:${String(roundedDuration % 60).padStart(2, "0")}`,
      },
      { new: true }
    );

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    return res.json({ success: true, reel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to update duration",
    });
  }
};

module.exports = {
  getMyReels,
  createReel,
  deleteReel,
  updateFavorite,
  updateDuration,
};
