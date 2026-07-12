const fs = require("fs/promises");
const path = require("path");

async function ensureAudioFolder(folderPath) {
  await fs.mkdir(folderPath, { recursive: true });
}

function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9-_\.]/gi, "_").slice(0, 255);
}

module.exports = {
  ensureAudioFolder,
  sanitizeFileName,
};