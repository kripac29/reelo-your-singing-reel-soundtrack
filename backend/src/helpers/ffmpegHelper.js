const { spawn } = require("child_process");
const path = require("path");

async function convertToMp3({ inputPath, outputPath }) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(
      "ffmpeg",
      [
        "-y",
        "-i",
        inputPath,
        "-vn",
        "-acodec",
        "libmp3lame",
        "-q:a",
        "2",
        outputPath,
      ],
      { shell: false },
    );

    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    ffmpeg.on("error", (err) => reject(new Error(`ffmpeg failed to start: ${err.message}`)));
    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      }
      return resolve(outputPath);
    });
  });
}

module.exports = { convertToMp3 };
