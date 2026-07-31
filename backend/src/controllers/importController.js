const path = require("path");
const fs = require("fs/promises");
const axios = require("axios");
const fsSync = require("fs");
const { pipeline } = require("stream/promises");
const http = require("http");
const https = require("https");
const { spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const { ensureAudioFolder } = require("../helpers/fileHelpers");
const { downloadAudioFromInstagram } = require("../helpers/ytDlpHelper");
const { convertToMp3 } = require("../helpers/ffmpegHelper");

const AUDIO_FOLDER = path.join(__dirname, "..", "..", "uploads", "audio");

const THUMBNAIL_FOLDER = path.join(__dirname, "..", "..", "uploads", "thumbnails");

async function downloadThumbnailImage(url, outputPath) {
  try {
    const parsedUrl = new URL(url);
    const driver = parsedUrl.protocol === "https:" ? https : http;

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await new Promise((resolve, reject) => {
      const request = driver.get(
        {
          hostname: parsedUrl.hostname,
          path: `${parsedUrl.pathname}${parsedUrl.search}`,
          protocol: parsedUrl.protocol,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
        (response) => {
          if (response.statusCode !== 200) {
            response.resume();
            return reject(new Error(`Thumbnail download failed with status ${response.statusCode}`));
          }

          const fileStream = fsSync.createWriteStream(outputPath);
          pipeline(response, fileStream)
            .then(resolve)
            .catch(reject);
        }
      );

      request.on("error", reject);
    });

    return true;
  } catch (error) {
    console.warn("Thumbnail download failed:", error.message || error);
    return false;
  }
}

async function importReelAudio({ instagramUrl, folderId }) {
  await ensureAudioFolder(AUDIO_FOLDER);

  const assetId = uuidv4();
  const tempFile = path.join(AUDIO_FOLDER, `${assetId}.%(ext)s`);
  const finalFile = path.join(AUDIO_FOLDER, `${assetId}.mp3`);

  let sourcePath;

  try {
    await fs.mkdir(THUMBNAIL_FOLDER, { recursive: true });

    const metadata = await downloadAudioFromInstagram({
      instagramUrl,
      outputTemplate: tempFile,
    });

    sourcePath = metadata.filePath;

    const convertedFilePath = await convertToMp3({
      inputPath: sourcePath,
      outputPath: finalFile,
    });

    if (convertedFilePath !== finalFile) {
      throw new Error("Audio conversion path mismatch");
    }

    await fs.rm(sourcePath, { force: true });

    const publicAudioPath = `/uploads/audio/${path.basename(finalFile)}`;
    const thumbnailFileName = `${uuidv4()}.jpg`;
    const thumbnailPath = path.join(THUMBNAIL_FOLDER, thumbnailFileName);
    const baseUrl = process.env.BACKEND_BASE_URL || "https://reelo-your-singing-reel-soundtrack.onrender.com";

    let thumbnailUrl = null;
    if (metadata.thumbnail) {
      const downloaded = await downloadThumbnailImage(metadata.thumbnail, thumbnailPath);
      if (downloaded) {
        thumbnailUrl = `${baseUrl}/uploads/thumbnails/${thumbnailFileName}`;
      }
    }

    const audioUrl = `${baseUrl}${publicAudioPath}`;

    return {
      title: metadata.title || metadata.id || "Instagram Reel",
      creator: metadata.creator || metadata.uploader || "Instagram",
      thumbnail: thumbnailUrl,
      thumbnailUrl,
      audioUrl,
      duration: metadata.duration || null,
      folderId: folderId || null,
    };
  } catch (error) {
    if (sourcePath) {
      await fs.rm(sourcePath, { force: true }).catch(() => {});
    }

    await fs.rm(finalFile, { force: true }).catch(() => {});

    throw error;
  }
}

module.exports = { importReelAudio };