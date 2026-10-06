# 🎵 Reelo — Instagram Reel Audio Playlist Platform

> Turn Instagram reels into your personal audio library.

## 📌 Overview

Reelo is a full-stack platform that lets users save audio from Instagram reels, organize them into playlists and folders, mark favorites, add mood tags, and listen through a persistent audio player.

## 🎯 Problem

Instagram makes it difficult to save and organize reel audio separately from video. Reelo provides a dedicated space to build and manage a personal reel-audio library.

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js, REST APIs  
**Database:** MongoDB  
**Media:** yt-dlp, FFmpeg  
**Auth & Services:** JWT, OTP, Brevo  
**Deployment:** Vercel, Render

## ⚙️ How It Works

```text
Instagram URL
     ↓
   yt-dlp
     ↓
 Media Extraction
     ↓
   FFmpeg
     ↓
 MP3 + Thumbnail
     ↓
 MongoDB + Reelo Player
```

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file with your MongoDB, JWT, and Brevo credentials.

### 4. Start the application

```bash
npm start
```

## 🌐 Live Demo

[Reelo →](https://reelo-your-singing-reel-soundtrack.vercel.app)

## 🔮 What's Next


- Better search and filtering
- AI-based recommendations
- Listening history

## 👩‍💻 Author

**Kripa Chawda**

[LinkedIn](https://www.linkedin.com/in/kripachawda/) · [GitHub](https://github.com/kripac29) · [Email](mailto:kripac29@gmail.com)

> Figuring it out along the way.
