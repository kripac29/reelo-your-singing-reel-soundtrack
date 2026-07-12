import { Music } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ReelCover({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageUrl = src?.trim() ? src : undefined;
  const showImage = Boolean(imageUrl && !error);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-slate-950/60", className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/10 via-white/5 to-white/10" />
      )}

      {showImage && (
        <img
          src={imageUrl}
          alt={alt ?? "Reel cover"}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition duration-700 ease-out",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {(error || !imageUrl) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-black/60 to-slate-900/90 text-white/70 px-3 text-center">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-primary shadow-inner">
            <Music className="w-5 h-5" />
          </div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{fallbackLabel ?? "No cover"}</div>
        </div>
      )}
    </div>
  );
}
