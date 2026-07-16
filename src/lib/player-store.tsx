import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Track } from "./mock-data";
import { useReels } from "@/lib/reels-store";

type PlayerState = {
  current: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number; // 0-100
  shuffle: boolean;
  loop: boolean;
  play: (t: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  setProgress: (n: number) => void;
  setVolume: (n: number) => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
};

const Ctx = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { reels } = useReels();
  const [current, setCurrent] = useState<Track | null>(reels[0] ?? null);
  const [queue, setQueue] = useState<Track[]>(reels);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(72);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    setQueue(reels);
    setCurrent((c) => c ?? reels[0] ?? null);
  }, [reels]);

  const play = useCallback((t: Track, q?: Track[]) => {
    setCurrent(t);
    if (q) setQueue(q);
    if (!t.audioUrl) {
      setIsPlaying(false);
      toast.error("This reel has no audio URL.", { description: "Edit the reel and add an audio link." });
      return;
    }
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (!current?.audioUrl) return;
    setIsPlaying((prev) => !prev);
  }, [current?.audioUrl]);

  const next = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const n = shuffle ? Math.floor(Math.random() * queue.length) : (idx + 1) % queue.length;
    const nextTrack = queue[n] ?? null;
    if (!nextTrack) {
      setIsPlaying(false);
      return;
    }
    setCurrent(nextTrack);
    setProgress(0);
    setIsPlaying(true);
  }, [current, queue, shuffle]);

  const prev = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const n = (idx - 1 + queue.length) % queue.length;
    const prevTrack = queue[n] ?? null;
    if (!prevTrack) {
      setIsPlaying(false);
      return;
    }
    setCurrent(prevTrack);
    setProgress(0);
    setIsPlaying(true);
  }, [current, queue]);

  const value = useMemo(
    () => ({
      current,
      queue,
      isPlaying,
      progress,
      volume,
      shuffle,
      loop,
      play,
      toggle,
      next,
      prev,
      setProgress: (n: number) => {
        const pct = Math.max(0, Math.min(100, n));
        setProgress(pct);
      },
      setVolume: (n: number) => {
        setVolume(Math.max(0, Math.min(100, n)));
      },
      toggleShuffle: () => setShuffle((s) => !s),
      toggleLoop: () => setLoop((s) => !s),
    }),
    [current, queue, isPlaying, progress, volume, shuffle, loop, play, toggle, next, prev]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer must be inside PlayerProvider");
  return v;
}
