const express = require("express");
const { importReelAudio } = require("../controllers/importController");

const router = express.Router();

router.post("/", async (req, res) => {
  const { instagramUrl, folderId } = req.body;

  if (!instagramUrl || typeof instagramUrl !== "string") {
    return res.status(400).json({ success: false, error: "instagramUrl is required" });
  }

  try {
    const result = await importReelAudio({ instagramUrl, folderId });
    console.log("Imported:", result.audioUrl);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Import error:", error);
    return res.status(500).json({ success: false, error: error.message || "Import failed" });
  }
});

module.exports = router;