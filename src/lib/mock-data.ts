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
  artist: string;
  cover: string;
  duration: string;
  mood?: string;
};

export const covers = [cover1, cover2, cover3, cover4, cover5, cover6];
export const artistImages = [artist1, artist2];

export const tracks: Track[] = [
  { id: "1", title: "Midnight Velvet", artist: "Aria Wren", cover: cover1, duration: "2:14", mood: "Late Night" },
  { id: "2", title: "Echoes of You", artist: "Liam Sage", cover: cover2, duration: "1:48", mood: "Heartbreak" },
  { id: "3", title: "Moonlit Whispers", artist: "Nova Rae", cover: cover3, duration: "2:31", mood: "Dreamy" },
  { id: "4", title: "Petals & Promises", artist: "Indie Bloom", cover: cover4, duration: "1:59", mood: "Romance" },
  { id: "5", title: "Rewind '99", artist: "Casey Lo", cover: cover5, duration: "2:08", mood: "Nostalgia" },
  { id: "6", title: "Stage Lights", artist: "Kai Monroe", cover: cover6, duration: "2:22", mood: "Confidence" },
  { id: "7", title: "Soft Static", artist: "Aria Wren", cover: cover2, duration: "1:36", mood: "Lo-fi" },
  { id: "8", title: "Glass Hearts", artist: "Nova Rae", cover: cover4, duration: "2:04", mood: "Heartbreak" },
];

export const playlists = [
  { id: "p1", title: "Late Night Singing", desc: "Reels for 2 a.m. feelings", cover: cover1, count: 24 },
  { id: "p2", title: "Heartbreak Hits", desc: "Cry, then repeat", cover: cover4, count: 18 },
  { id: "p3", title: "Indie Voices", desc: "Hidden gems, raw covers", cover: cover6, count: 32 },
  { id: "p4", title: "Dreamy Covers", desc: "Float-away vibes", cover: cover3, count: 21 },
  { id: "p5", title: "Throwback Reels", desc: "2010s nostalgia", cover: cover5, count: 14 },
  { id: "p6", title: "Soundwave Sessions", desc: "Acoustic & raw", cover: cover2, count: 27 },
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

export const artists = [
  { name: "Aria Wren", image: artist1, followers: "2.1M" },
  { name: "Liam Sage", image: artist2, followers: "1.4M" },
  { name: "Nova Rae", image: artist1, followers: "892K" },
  { name: "Kai Monroe", image: artist2, followers: "1.7M" },
];
