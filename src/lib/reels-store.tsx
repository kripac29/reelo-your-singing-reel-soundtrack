import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Track } from "@/lib/mock-data";
import { apiFetch, getApiError, getStoredToken } from "@/lib/api";

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
    const token = getStoredToken();
    if (!token) {
      setReels([]);
      setError(null);
      return;
    }

    const response = await apiFetch("/reels");
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(typeof data?.message === "string" ? data.message : "Unable to load saved reels");

    setReels(Array.isArray(data?.reels) ? data.reels.map(mapReel) : []);
    setError(null);
  }, []);

  useEffect(() => {
    void reloadReels().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Unable to load saved reels");
    });
  }, [reloadReels]);

  const addReel = useCallback(async (reel: NewReel) => {
    const response = await apiFetch("/reels", {
      method: "POST",
      body: JSON.stringify(reel),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = typeof data?.message === "string" ? data.message : "Unable to save reel";
      setError(message);
      throw new Error(message);
    }

    const created = mapReel(data?.reel);
    setReels((previous) => [created, ...previous]);
    setError(null);
    return created;
  }, []);

  const removeReel = useCallback(async (id: string) => {
    const response = await apiFetch(`/reels/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) throw await getApiError(response, "Unable to delete reel");
    setReels((previous) => previous.filter((reel) => reel.id !== id));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const reel = reels.find((item) => item.id === id);
    if (!reel) throw new Error("Reel not found");

    const response = await apiFetch(`/reels/${encodeURIComponent(id)}/favorite`, {
      method: "PATCH",
      body: JSON.stringify({ isFavorite: !reel.isFavorite }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = typeof data?.message === "string" ? data.message : "Unable to update favorite";
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

    const response = await apiFetch(`/reels/${encodeURIComponent(id)}/duration`, {
      method: "PATCH",
      body: JSON.stringify({ durationSeconds: roundedDuration }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = typeof data?.message === "string" ? data.message : "Unable to update duration";
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
