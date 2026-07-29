import { useEffect, useRef } from "react";
import { usePlayer } from "@/lib/player-store";
import { useReels } from "@/lib/reels-store";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const p = usePlayer();
  const { updateDuration } = useReels();

  useEffect(() => {
    if (!audioRef.current) return;

    const src = p.current?.audioUrl || "";
    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
      audioRef.current.currentTime = 0;
    }

    if (!src) {
      audioRef.current.pause();
      return;
    }

    if (p.isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [p.current?.audioUrl, p.current?.id, p.isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.max(0, Math.min(1, p.volume / 100));
  }, [p.volume]);

  useEffect(() => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const targetTime = (p.progress / 100) * audioRef.current.duration;
    if (Math.abs(audioRef.current.currentTime - targetTime) > 0.5) {
      audioRef.current.currentTime = targetTime;
    }
  }, [p.progress]);

  const handleTimeUpdate = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    p.setProgress(progress);
  };

  const handleEnded = () => {
    if (p.loop) {
      p.setProgress(0);
      audioRef.current?.play().catch(() => {});
    } else {
      p.next();
    }
  };

  return (
    <audio
      ref={audioRef}
      onLoadedMetadata={() => {
        const durationSeconds = audioRef.current?.duration;
        if (p.current && durationSeconds && Number.isFinite(durationSeconds)) {
          void updateDuration(p.current.id, durationSeconds).catch(() => {});
        }
      }}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onError={() => {
        console.error("Audio playback error for:", p.current?.audioUrl);
      }}
    />
  );
}
