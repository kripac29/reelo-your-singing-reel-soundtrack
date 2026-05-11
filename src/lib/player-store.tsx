import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { tracks, type Track } from "./mock-data";

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
  const [current, setCurrent] = useState<Track | null>(tracks[0]);
  const [queue, setQueue] = useState<Track[]>(tracks);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(34);
  const [volume, setVolume] = useState(72);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  const play = useCallback((t: Track, q?: Track[]) => {
    setCurrent(t);
    if (q) setQueue(q);
    setIsPlaying(true);
    setProgress(0);
  }, []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);
  const next = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const n = shuffle ? Math.floor(Math.random() * queue.length) : (idx + 1) % queue.length;
    setCurrent(queue[n]);
    setProgress(0);
  }, [current, queue, shuffle]);
  const prev = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const n = (idx - 1 + queue.length) % queue.length;
    setCurrent(queue[n]);
    setProgress(0);
  }, [current, queue]);

  const value = useMemo(
    () => ({
      current, queue, isPlaying, progress, volume, shuffle, loop,
      play, toggle, next, prev, setProgress, setVolume,
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
