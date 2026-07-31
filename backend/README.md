# Reelo Audio Backend

This backend service accepts Instagram reel URLs, downloads audio via `yt-dlp`, converts to MP3 via `ffmpeg`, and serves local audio files.

## Requirements

- Node.js 18+
- `yt-dlp` installed and available in `$PATH`
- `ffmpeg` installed and available in `$PATH`

## Install

```bash
cd backend
npm install
```

## Run

```bash
npm run dev
```

## API

POST `/api/import`

Request body:

```json
{
  "instagramUrl": "https://www.instagram.com/reel/XXXX",
  "folderId": "p1"
}
```

Response:

```json
{
  "success": true,
  "title": "...",
  "creator": "...",
  "audioUrl": "http://https://reelo-your-singing-reel-soundtrack.onrender.com/uploads/audio/xxxx.mp3",
  "thumbnail": "...",
  "duration": 42,
  "folderId": "p1"
}
```

## Notes

- Local audio files are served from `/uploads/audio`.
- The frontend should use the returned `audioUrl` for playback.
- This design avoids direct Instagram CDN playback and CORS issues.
