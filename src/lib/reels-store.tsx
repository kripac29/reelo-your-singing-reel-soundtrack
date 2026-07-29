import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Track } from "@/lib/mock-data";

const API_BASE_URL = "http://localhost:5000/api";
type NewReel = Omit<Track, "id"> & { id?: string };

type ReelsState = {
  reels: Track[];
  addReel: (reel: NewReel) => Promise<Track>;
  removeReel: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateDuration: (id: string, durationSeconds: number) => Promise<void>;
  error: string | null;
  reloadReels: () => Promise<void>;
};

const Ctx = createContext<ReelsState | null>(null);

function getHeaders(): Record<string, string> {
  const token = typeof window === "undefined" ? null : window.localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function messageFrom(payload: unknown, fallback: string) {
  return typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
    ? payload.message
    : fallback;
}

function mapReel(reel: any): Track {
  return {
    id: reel?._id ?? reel?.id,
    title: reel?.title ?? "Instagram Reel",
    artist: reel?.artist ?? "Instagram",
    cover: reel?.cover ?? reel?.thumbnailUrl ?? reel?.thumbnail ?? "",
    duration: reel?.duration ?? "",
    mood: reel?.mood,
    savedAt: reel?.savedAt,
    sourceUrl: reel?.sourceUrl,
    folderId: reel?.folderId,
    audioUrl: reel?.audioUrl,
    durationSeconds: reel?.durationSeconds,
    thumbnail: reel?.thumbnail,
    thumbnailUrl: reel?.thumbnailUrl,
    isFavorite: Boolean(reel?.isFavorite),
  };
}

export function ReelsProvider({ children }: { children: ReactNode }) {
  const [reels, setReels] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reloadReels = useCallback(async () => {
    const token = typeof window === "undefined" ? null : window.localStorage.getItem("token");
    if (!token) {
      setReels([]);
      setError(null);
      return;
    }

    const response = await fetch(`${API_BASE_URL}/reels`, { headers: getHeaders(), credentials: "include" });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(messageFrom(data, "Unable to load saved reels"));

    setReels(Array.isArray(data?.reels) ? data.reels.map(mapReel) : []);
    setError(null);
  }, []);

  useEffect(() => {
    void reloadReels().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Unable to load saved reels");
    });
  }, [reloadReels]);

  const addReel = useCallback(async (reel: NewReel) => {
    const response = await fetch(`${API_BASE_URL}/reels`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(reel),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = messageFrom(data, "Unable to save reel");
      setError(message);
      throw new Error(message);
    }

    const created = mapReel(data?.reel);
    setReels((previous) => [created, ...previous]);
    setError(null);
    return created;
  }, []);

  const removeReel = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reels/${id}`, { method: "DELETE", headers: getHeaders(), credentials: "include" });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(messageFrom(data, "Unable to delete reel"));
    setReels((previous) => previous.filter((reel) => reel.id !== id));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const reel = reels.find((item) => item.id === id);
    if (!reel) throw new Error("Reel not found");

    const response = await fetch(`${API_BASE_URL}/reels/${id}/favorite`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ isFavorite: !reel.isFavorite }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = messageFrom(data, "Unable to update favorite");
      setError(message);
      throw new Error(message);
    }

    const updated = mapReel(data?.reel);
    setReels((previous) => previous.map((item) => (item.id === id ? updated : item)));
    setError(null);
  }, [reels]);

  const updateDuration = useCallback(async (id: string, durationSeconds: number) => {
    const roundedDuration = Math.round(durationSeconds);
    const reel = reels.find((item) => item.id === id);
    if (!reel || reel.durationSeconds === roundedDuration) return;

    const response = await fetch(`${API_BASE_URL}/reels/${id}/duration`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ durationSeconds: roundedDuration }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = messageFrom(data, "Unable to update duration");
      setError(message);
      throw new Error(message);
    }

    const updated = mapReel(data?.reel);
    setReels((previous) => previous.map((item) => (item.id === id ? updated : item)));
    setError(null);
  }, [reels]);

  const value = useMemo(() => ({ reels, addReel, removeReel, toggleFavorite, updateDuration, error, reloadReels }), [reels, addReel, removeReel, toggleFavorite, updateDuration, error, reloadReels]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReels() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReels must be inside ReelsProvider");
  return ctx;
}
