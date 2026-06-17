import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Track } from "@/lib/mock-data";

// v2: start empty (no demo reels); avoid pulling in previously seeded data.
const STORAGE_KEY = "reelo:saved-reels:v2";

type ReelsState = {
  reels: Track[];
  addReel: (reel: Track) => void;
  removeReel: (id: string) => void;
};

const Ctx = createContext<ReelsState | null>(null);

function safeLoad(): Track[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Track[];
  } catch {
    return null;
  }
}

function safeSave(reels: Track[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
  } catch {
    // ignore storage quota / disabled storage
  }
}

export function ReelsProvider({ children }: { children: ReactNode }) {
  const [reels, setReels] = useState<Track[]>(() => []);

  useEffect(() => {
    const loaded = safeLoad();
    if (loaded) setReels(loaded);
  }, []);

  useEffect(() => {
    safeSave(reels);
  }, [reels]);

  const addReel = useCallback((reel: Track) => {
    setReels((prev) => [reel, ...prev]);
  }, []);

  const removeReel = useCallback((id: string) => {
    setReels((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = useMemo(() => ({ reels, addReel, removeReel }), [reels, addReel, removeReel]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReels() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useReels must be inside ReelsProvider");
  return v;
}

