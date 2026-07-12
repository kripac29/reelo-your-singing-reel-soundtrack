import { useEffect, useRef } from "react";

export function LocalAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  }, [audioUrl]);

  return (
    <audio ref={audioRef} controls className="w-full">
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
