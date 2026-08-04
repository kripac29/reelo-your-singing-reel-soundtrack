const path = require("path");
const { spawn } = require("child_process");

function runYtdlp(args) {
  return new Promise((resolve, reject) => {
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
        return reject(new Error(`yt-dlp exited with code ${code}: ${stderr.trim()}`));
      }

      try {
        const metadata = JSON.parse(stdout.trim().split("\n").slice(-1)[0]);
        const ext = metadata.ext || "mp3";
        const filePath = path.resolve(metadata._filename || `${metadata.id}.${ext}`);
        return resolve({
          ...metadata,
          filePath,
          title: metadata.title,
          creator: metadata.uploader,
          thumbnail: metadata.thumbnail,
          duration: metadata.duration,
        });
      } catch (error) {
        return reject(new Error(`Failed to parse yt-dlp output: ${error.message}\n${stderr.trim()}`));
      }
    });
  });
}

function buildYtdlpArgs(instagramUrl, outputTemplate) {
  const args = [
    "--extractor-retries",
    "5",
    "--retries",
    "5",
    instagramUrl,
    "--no-playlist",
    "-f",
    "best",
    "-o",
    outputTemplate,
    "--write-thumbnail",
    "--add-metadata",
    "--print-json",
    "--no-warnings",
    "--no-progress",
  ];

  const cookiesFile = process.env.INSTAGRAM_COOKIES_PATH || process.env.YT_DLP_COOKIES_PATH;
  if (cookiesFile) {
    return ["--cookies", cookiesFile, ...args];
  }

  // Only attempt browser cookie extraction when explicitly enabled.
  if (process.env.YT_DLP_USE_BROWSER_COOKIES === "true") {
    const browser = process.env.YT_DLP_COOKIES_BROWSER || "edge";
    return ["--cookies-from-browser", browser, ...args];
  }

  return args;
}

async function downloadAudioFromInstagram({ instagramUrl, outputTemplate }) {
  const args = buildYtdlpArgs(instagramUrl, outputTemplate);

  try {
    return await runYtdlp(args);
  } catch (error) {
    const message = String(error.message || "").toLowerCase();
    if (args.includes("--cookies-from-browser") && message.includes("could not copy chrome cookie database")) {
      throw new Error(
        "Instagram import failed because browser cookie extraction is unavailable. Set YT_DLP_USE_BROWSER_COOKIES=false or provide a cookies file with INSTAGRAM_COOKIES_PATH."
      );
    }

    if (message.includes("instagram sent an empty media response")) {
      throw new Error(
        "Instagram import failed because the reel is not accessible without login. Use a public reel URL or provide cookies via INSTAGRAM_COOKIES_PATH."
      );
    }

    throw error;
  }
}

module.exports = { downloadAudioFromInstagram };
