import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const INSTAGRAM_HOST = /instagram\.com/i;

function findExecutable(name: string): string {
  const base = name.replace(/\.exe$/i, "");
  const exe = process.platform === "win32" ? `${base}.exe` : base;
  const local = process.env.LOCALAPPDATA;
  const candidates = [
    base,
    exe,
    local ? path.join(local, "Microsoft", "WinGet", "Links", exe) : "",
    local ? path.join(local, "Microsoft", "WinGet", "Packages") : "",
  ].filter(Boolean) as string[];

  for (const c of candidates) {
    if (c.endsWith("Packages")) continue;
    try {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    } catch {
      /* ignore */
    }
  }

  const where = spawnSync("where", [exe], { encoding: "utf-8", shell: true });
  if (where.status === 0 && where.stdout?.trim()) {
    const first = where.stdout.trim().split(/\r?\n/)[0];
    if (first && fs.existsSync(first)) return first;
  }

  return base;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

export function reelImportDevPlugin(): Plugin {
  return {
    name: "reel-import-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/reel-import") || req.method !== "POST") {
          next();
          return;
        }

        const root = server.config.root;
        const importsDir = path.join(root, "public", "imports");
        try {
          fs.mkdirSync(importsDir, { recursive: true });
        } catch {
          /* ignore */
        }

        let body: { url?: string };
        try {
          body = JSON.parse(await readBody(req)) as { url?: string };
        } catch {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid JSON body" }));
          return;
        }

        const reelUrl = (body.url ?? "").trim();
        if (!reelUrl || !INSTAGRAM_HOST.test(reelUrl)) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Paste a valid instagram.com link." }));
          return;
        }

        const ytDlp = findExecutable("yt-dlp");
        const stamp = Date.now();
        const outTemplate = path.join(importsDir, `reel-${stamp}.%(ext)s`);

        const result = spawnSync(
          ytDlp,
          [
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "0",
            "--no-playlist",
            "-o",
            outTemplate,
            "--no-warnings",
            reelUrl,
          ],
          {
            encoding: "utf-8",
            timeout: 180_000,
            maxBuffer: 20 * 1024 * 1024,
          },
        );

        if (result.status !== 0) {
          const err = [result.stderr, result.stdout].filter(Boolean).join("\n").slice(0, 2000);
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: "Import failed. Is yt-dlp on PATH? Restart the terminal after winget install, then restart `npm run dev`.",
              detail: err || `exit ${result.status}`,
            }),
          );
          return;
        }

        const matches = fs.readdirSync(importsDir).filter((f) => f.startsWith(`reel-${stamp}.`));
        const audioFile = matches.find((f) => /\.(mp3|m4a|opus|webm)$/i.test(f)) ?? matches[0];
        if (!audioFile) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "No audio file produced after import.", matches }));
          return;
        }

        const publicUrl = `/imports/${audioFile}`;
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ audioUrl: publicUrl }));
      });
    },
  };
}
