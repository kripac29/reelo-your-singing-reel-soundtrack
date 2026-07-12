import { useEffect, useRef } from "react";
import { usePlayer } from "@/lib/player-store";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const p = usePlayer();

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Use audioUrl if available (backend-served), otherwise fall back to empty
    const src = p.current?.audioUrl || "";
    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
      if (p.isPlaying && src) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [p.current?.id, p.current?.audioUrl]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (p.isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [p.isPlaying]);

  // Sync volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.max(0, Math.min(1, p.volume / 100));
  }, [p.volume]);

  // Sync progress
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const targetTime = (p.progress / 100) * audioRef.current.duration;
    if (Math.abs(audioRef.current.currentTime - targetTime) > 0.5) {
      audioRef.current.currentTime = targetTime;
    }
  }, [p.progress]);

  // Handle audio events
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
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onError={() => {
        console.error("Audio playback error for:", p.current?.audioUrl);
      }}
    />
  );
}
