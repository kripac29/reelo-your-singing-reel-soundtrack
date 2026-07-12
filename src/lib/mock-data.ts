import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import cover4 from "@/assets/cover-4.jpg";
import cover5 from "@/assets/cover-5.jpg";
import cover6 from "@/assets/cover-6.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";

export type Track = {
  id: string;
  title: string;
  artist: string; // creator handle
  subtitle?: string; // first emotional caption line
  cover: string;
  duration: string;
  mood?: string;
  savedAt?: string; // human label e.g. "2 days ago"
  sourceUrl?: string; // original instagram reel link
  folderId?: string;
  audioUrl?: string; // backend-served mp3 url
  durationSeconds?: number; // duration in seconds from backend
  thumbnail?: string; // legacy thumbnail field
  thumbnailUrl?: string; // local backend-served thumbnail URL
};

export const covers = [cover1, cover2, cover3, cover4, cover5, cover6];
export const artistImages = [artist1, artist2];

export const tracks: Track[] = [
  { id: "1", title: "Midnight Velvet — bathroom take", artist: "@aria.wren", cover: cover1, duration: "0:42", mood: "Late Night", savedAt: "2h ago", sourceUrl: "https://instagram.com/reel/xyz1" },
  { id: "2", title: "Echoes of You (cover)", artist: "@liam.sage", cover: cover2, duration: "0:58", mood: "Heartbreak", savedAt: "yesterday", sourceUrl: "https://instagram.com/reel/xyz2" },
  { id: "3", title: "Moonlit Whispers — balcony", artist: "@nova.rae", cover: cover3, duration: "1:01", mood: "Dreamy", savedAt: "3 days ago" },
  { id: "4", title: "Petals & Promises", artist: "@indie.bloom", cover: cover4, duration: "0:49", mood: "Romance", savedAt: "1 week ago" },
  { id: "5", title: "Rewind '99 — car singing", artist: "@casey.lo", cover: cover5, duration: "0:38", mood: "Nostalgia", savedAt: "1 week ago" },
  { id: "6", title: "Stage Lights (snippet)", artist: "@kai.monroe", cover: cover6, duration: "0:52", mood: "Confidence", savedAt: "2 weeks ago" },
  { id: "7", title: "Soft Static — 2am demo", artist: "@aria.wren", cover: cover2, duration: "0:36", mood: "Lo-fi", savedAt: "3 weeks ago" },
  { id: "8", title: "Glass Hearts", artist: "@nova.rae", cover: cover4, duration: "1:04", mood: "Heartbreak", savedAt: "1 month ago" },
];

export type Playlist = {
  id: string;
  title: string;
  desc: string;
  cover: string;
  count: number;
};

export const playlists: Playlist[] = [
  { id: "p1", title: "Late Night Singing", desc: "Reels for 2 a.m. feelings", cover: cover1, count: 24 },
  { id: "p2", title: "Heartbreak Hits", desc: "Cry, then repeat", cover: cover4, count: 18 },
  { id: "p3", title: "Indie Voices I Found", desc: "Hidden creators worth saving", cover: cover6, count: 32 },
  { id: "p4", title: "Dreamy Covers", desc: "Float-away vibes", cover: cover3, count: 21 },
  { id: "p5", title: "Throwback Reels", desc: "2010s nostalgia", cover: cover5, count: 14 },
  { id: "p6", title: "Acoustic Sessions", desc: "Raw guitar + voice", cover: cover2, count: 27 },
];

export const defaultPlaylists: Playlist[] = playlists;

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
  { name: "@aria.wren", image: artist1, followers: "12 reels saved" },
  { name: "@liam.sage", image: artist2, followers: "8 reels saved" },
  { name: "@nova.rae", image: artist1, followers: "5 reels saved" },
  { name: "@kai.monroe", image: artist2, followers: "9 reels saved" },
];
