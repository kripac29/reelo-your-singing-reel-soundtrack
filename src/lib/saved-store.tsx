import { useCallback, useEffect, useState } from "react";
import { covers, type Track } from "./mock-data";
import {
  normalizeCreatorName,
  normalizeTrackTitle,
  extractCaptionSubtitle
} from "@/lib/reel-utils";
const KEY = "reelo:savedReels:v1";

function sanitizeTrack(track: Track): Track {
  const thumbnailUrl = typeof track.thumbnailUrl === "string" && track.thumbnailUrl.trim() ? track.thumbnailUrl.trim() : undefined;
  const thumbnail = typeof track.thumbnail === "string" && track.thumbnail.trim() ? track.thumbnail.trim() : undefined;
  const cover = typeof track.cover === "string" && track.cover.trim() ? track.cover.trim() : undefined;

  return {
    ...track,
    title: normalizeTrackTitle(track.title) ?? `Instagram reel ${new Date().toLocaleString()}`,
    artist: normalizeCreatorName(track.artist),
    thumbnailUrl,
    thumbnail: thumbnail ?? thumbnailUrl,
    cover: cover ?? thumbnailUrl ?? thumbnail ?? covers[Math.floor(Math.random() * covers.length)],
    savedAt: track.savedAt?.trim() ? track.savedAt : "saved recently",
    duration: track.duration?.trim() ? track.duration : "0:45",
  };
}

function readStored(): Track[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Track[]).map(sanitizeTrack);
  } catch (e) {
    return [];
  }
}

function writeStored(v: Track[]) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch (e) {
    // ignore
  }
}

// In-memory singleton store so multiple hook instances stay in sync within the same tab.
const store = {
  data: [] as Track[],
  listeners: new Set<(v: Track[]) => void>(),
  init() {
    if (this.data.length === 0) this.data = readStored();
  },
  notify() {
    for (const l of this.listeners) l(this.data);
  },
  subscribe(fn: (v: Track[]) => void) {
    this.listeners.add(fn);
    fn(this.data);
    return () => {
      this.listeners.delete(fn);
    };
  },
  add(t: Track) {
    this.data = [t, ...this.data];
    writeStored(this.data);
    this.notify();
  },
  remove(id: string) {
    this.data = this.data.filter((x) => x.id !== id);
    writeStored(this.data);
    this.notify();
  },
  clear() {
    this.data = [];
    writeStored(this.data);
    this.notify();
  },
};

store.init();

export function useSavedReels() {
  const [saved, setSaved] = useState<Track[]>(() => {
    // read initial snapshot from singleton
    return store.data;
  });

  useEffect(() => {
    const unsub = store.subscribe((v) => setSaved(v));
    return unsub;
  }, []);

  const add = useCallback((sourceUrl: string, opts?: { title?: string; artist?: string; folderId?: string; audioUrl?: string; durationSeconds?: number; thumbnail?: string | null; thumbnailUrl?: string | null }) => {
    const now = Date.now();
    const thumbnailUrl = typeof opts?.thumbnailUrl === "string" && opts.thumbnailUrl?.trim() ? opts.thumbnailUrl.trim() : undefined;
    const thumbnail = typeof opts?.thumbnail === "string" && opts.thumbnail?.trim() ? opts.thumbnail.trim() : undefined;
    const coverSource = thumbnailUrl ?? thumbnail;
    const t: Track = {
      id: String(now),
      title: normalizeTrackTitle(opts?.title) ?? `Instagram reel ${new Date(now).toLocaleString()}`,
      artist: normalizeCreatorName(opts?.artist),
      cover: coverSource ?? covers[Math.floor(Math.random() * covers.length)],
      duration: "0:45",
      savedAt: "just now",
      sourceUrl,
      folderId: opts?.folderId,
      audioUrl: opts?.audioUrl,
      durationSeconds: opts?.durationSeconds,
      thumbnailUrl,
      thumbnail: thumbnail ?? thumbnailUrl,
    };
    store.add(sanitizeTrack(t));
  }, []);

  const remove = useCallback((id: string) => store.remove(id), []);
  const clearAll = useCallback(() => store.clear(), []);

  return { saved, add, remove, clearAll } as const;
}

export default useSavedReels;
