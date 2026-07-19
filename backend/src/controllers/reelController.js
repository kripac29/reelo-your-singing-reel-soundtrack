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

module.exports = {
  getMyReels,
  createReel,
  deleteReel,
};
