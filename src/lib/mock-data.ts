import { artistUrls, coverUrls, demoAudioUrl } from "@/lib/image-assets";

export type Track = {
  id: string;
  title: string;
  artist: string; // creator handle
  cover: string;
  audioUrl?: string;
  folderId?: string;
  instagramUrl?: string;
  savedAt?: number;
  duration: string;
  mood?: string;
  savedAt?: string; // human label e.g. "2 days ago"
  sourceUrl?: string; // original instagram reel link
};

export const covers = coverUrls;
export const artistImages = artistUrls;

export const tracks: Track[] = [
  { id: "1", title: "Midnight Velvet", artist: "Aria Wren", cover: coverUrls[0], audioUrl: demoAudioUrl, duration: "2:14", mood: "Late Night", savedAt: Date.now() - 1000 * 60 * 60 * 7 },
  { id: "2", title: "Echoes of You", artist: "Liam Sage", cover: coverUrls[1], audioUrl: demoAudioUrl, duration: "1:48", mood: "Heartbreak", savedAt: Date.now() - 1000 * 60 * 60 * 22 },
  { id: "3", title: "Moonlit Whispers", artist: "Nova Rae", cover: coverUrls[2], audioUrl: demoAudioUrl, duration: "2:31", mood: "Dreamy", savedAt: Date.now() - 1000 * 60 * 60 * 30 },
  { id: "4", title: "Petals & Promises", artist: "Indie Bloom", cover: coverUrls[3], audioUrl: demoAudioUrl, duration: "1:59", mood: "Romance", savedAt: Date.now() - 1000 * 60 * 60 * 48 },
  { id: "5", title: "Rewind '99", artist: "Casey Lo", cover: coverUrls[4], audioUrl: demoAudioUrl, duration: "2:08", mood: "Nostalgia", savedAt: Date.now() - 1000 * 60 * 60 * 60 },
  { id: "6", title: "Stage Lights", artist: "Kai Monroe", cover: coverUrls[5], audioUrl: demoAudioUrl, duration: "2:22", mood: "Confidence", savedAt: Date.now() - 1000 * 60 * 60 * 80 },
  { id: "7", title: "Soft Static", artist: "Aria Wren", cover: coverUrls[1], audioUrl: demoAudioUrl, duration: "1:36", mood: "Lo-fi", savedAt: Date.now() - 1000 * 60 * 60 * 90 },
  { id: "8", title: "Glass Hearts", artist: "Nova Rae", cover: coverUrls[3], audioUrl: demoAudioUrl, duration: "2:04", mood: "Heartbreak", savedAt: Date.now() - 1000 * 60 * 60 * 110 },
];

export const playlists = [
  { id: "p1", title: "Late Night Singing", desc: "Reels for 2 a.m. feelings", cover: coverUrls[0], count: 24 },
  { id: "p2", title: "Heartbreak Beats", desc: "Cry, then repeat", cover: coverUrls[3], count: 18 },
  { id: "p3", title: "Indie Voices", desc: "Hidden gems, raw covers", cover: coverUrls[5], count: 32 },
  { id: "p4", title: "Dreamy Covers", desc: "Float-away vibes", cover: coverUrls[2], count: 21 },
  { id: "p5", title: "Throwback Reels", desc: "2010s nostalgia", cover: coverUrls[4], count: 14 },
  { id: "p6", title: "Soundwave Sessions", desc: "Acoustic & raw", cover: coverUrls[1], count: 27 },
];

export const moods = [
  { name: "Late Night", gradient: "from-indigo-500 to-purple-600" },
  { name: "Heartbreak", gradient: "from-pink-500 to-rose-600" },
  { name: "Dreamy", gradient: "from-fuchsia-500 to-purple-500" },
  { name: "Romance", gradient: "from-rose-400 to-pink-600" },
  { name: "Nostalgia", gradient: "from-amber-500 to-pink-500" },
  { name: "Confidence", gradient: "from-violet-500 to-blue-600" },
  { name: "Lo-fi", gradient: "from-cyan-500 to-indigo-600" },
  { name: "Acoustic", gradient: "from-emerald-500 to-teal-600" },
];

// Creators the user has bookmarked (from Instagram)
export const artists = [
  { name: "Aria Wren", image: artistUrls[0], followers: "2.1M" },
  { name: "Liam Sage", image: artistUrls[1], followers: "1.4M" },
  { name: "Nova Rae", image: artistUrls[0], followers: "892K" },
  { name: "Kai Monroe", image: artistUrls[1], followers: "1.7M" },
];
