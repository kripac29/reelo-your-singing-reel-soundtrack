const path = require("path");
const { spawn } = require("child_process");

async function downloadAudioFromInstagram({ instagramUrl, outputTemplate }) {
  return new Promise((resolve, reject) => {
    const args = [
      instagramUrl,
      "--no-playlist",
      "-f",
      "bestaudio",
      "-o",
      outputTemplate,
      "--write-thumbnail",
      "--add-metadata",
      "--print-json",
      "--no-warnings",
      "--no-progress",
    ];

    const ytdlp = spawn("yt-dlp", args, { shell: false });
    let stdout = "";
    let stderr = "";

    ytdlp.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    ytdlp.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    ytdlp.on("error", (err) => reject(new Error(`yt-dlp failed to start: ${err.message}`)));

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
      }

      try {
        const metadata = JSON.parse(stdout.trim().split("\n").slice(-1)[0]);
        console.log(JSON.stringify(metadata, null, 2));
        const ext = metadata.ext || "mp3";
        const filePath = path.resolve(metadata._filename || `${metadata.id}.${ext}`);
        return resolve({ ...metadata, filePath, title: metadata.title, creator: metadata.uploader, thumbnail: metadata.thumbnail, duration: metadata.duration });
      } catch (error) {
        return reject(new Error(`Failed to parse yt-dlp output: ${error.message}\n${stderr}`));
      }
    });
  });
}

module.exports = { downloadAudioFromInstagram };
