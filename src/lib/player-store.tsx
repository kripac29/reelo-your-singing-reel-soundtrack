import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  const [progress, setProgress] = useState(34);
  const [volume, setVolume] = useState(72);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep queue in sync when reels change (e.g. after saving).
  useEffect(() => {
    setQueue(reels);
    setCurrent((c) => c ?? reels[0] ?? null);
  }, [reels]);

  // Create and wire up a single audio element.
  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    a.volume = volume / 100;
    audioRef.current = a;

    const onTimeUpdate = () => {
      const dur = a.duration || 0;
      const pct = dur ? (a.currentTime / dur) * 100 : 0;
      setProgress(Number.isFinite(pct) ? pct : 0);
    };
    const onEnded = () => {
      if (loop) return;
      // Auto-advance to the next reel in queue.
      const cur = current;
      if (!cur) {
        setIsPlaying(false);
        return;
      }
      const idx = queue.findIndex((t) => t.id === cur.id);
      const n = shuffle ? Math.floor(Math.random() * queue.length) : (idx + 1) % queue.length;
      const nextTrack = queue[n];
      setCurrent(nextTrack);
      setProgress(0);
      if (nextTrack?.audioUrl) {
        a.src = nextTrack.audioUrl;
        a.currentTime = 0;
        a.play().catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.pause();
      a.src = "";
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the current reel changes, make sure the audio source follows (but don't autoplay).
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current?.audioUrl) return;
    if (a.src !== current.audioUrl) a.src = current.audioUrl;
  }, [current]);

  // Apply loop + volume to element.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = loop;
  }, [loop]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = Math.max(0, Math.min(1, volume / 100));
  }, [volume]);

  const play = useCallback((t: Track, q?: Track[]) => {
    setCurrent(t);
    if (q) setQueue(q);
    const a = audioRef.current;
    if (!a) return;
    if (!t.audioUrl) {
      toast.error("This reel has no audio URL.", { description: "Edit the reel and add an audio link." });
      return;
    }
    if (a.src !== t.audioUrl) a.src = t.audioUrl;
    a.currentTime = 0;
    a.play().then(() => {
      setProgress(0);
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
      toast.error("Couldn’t play this audio.", { description: "The audio URL may block cross-origin playback." });
    });
  }, []);
  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {
        setIsPlaying(false);
        toast.error("Couldn’t start playback.");
      });
    } else {
      a.pause();
    }
  }, []);
  const next = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const n = shuffle ? Math.floor(Math.random() * queue.length) : (idx + 1) % queue.length;
    const nextTrack = queue[n];
    setCurrent(nextTrack);
    setProgress(0);
    const a = audioRef.current;
    if (a && nextTrack?.audioUrl) {
      a.src = nextTrack.audioUrl;
      a.currentTime = 0;
      a.play().catch(() => setIsPlaying(false));
    }
  }, [current, queue, shuffle]);
  const prev = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const n = (idx - 1 + queue.length) % queue.length;
    const prevTrack = queue[n];
    setCurrent(prevTrack);
    setProgress(0);
    const a = audioRef.current;
    if (a && prevTrack?.audioUrl) {
      a.src = prevTrack.audioUrl;
      a.currentTime = 0;
      a.play().catch(() => setIsPlaying(false));
    }
  }, [current, queue]);

  const value = useMemo(
    () => ({
      current, queue, isPlaying, progress, volume, shuffle, loop,
      play,
      toggle,
      next,
      prev,
      setProgress: (n: number) => {
        const a = audioRef.current;
        if (!a) return;
        const pct = Math.max(0, Math.min(100, n));
        const dur = a.duration || 0;
        if (dur) a.currentTime = (pct / 100) * dur;
        setProgress(pct);
      },
      setVolume,
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
