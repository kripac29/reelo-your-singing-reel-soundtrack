import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "@/lib/player-store";
import { getTrackCover } from "@/lib/reel-utils";
import { ReelCover } from "@/components/ReelCover";
import type { Track } from "@/lib/mock-data";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatDuration } from "@/lib/duration";

export function MusicCard({ track, queue }: { track: Track; queue?: Track[] }) {
  const p = usePlayer();
  const isCurrent = p.current?.id === track.id;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => p.play(track, queue)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") p.play(track, queue);
      }}
      className="group relative text-left glass rounded-2xl p-3 transition hover:shadow-[0_20px_60px_-20px_oklch(0.72_0.3_350/0.4)]"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <ReelCover src={getTrackCover(track)} alt={track.title} className="h-full w-full" fallbackLabel="Reel cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full gradient-brand grid place-items-center text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition shadow-[0_8px_30px_oklch(0.72_0.3_350/0.6)]">
          <Play className="w-4 h-4 ml-0.5" />
        </div>
        {isCurrent && p.isPlaying && (
          <div className="absolute top-2 left-2 flex items-end gap-0.5 h-5 bg-black/40 backdrop-blur px-1.5 rounded-md">
            {[0, 0.2, 0.4].map((d, i) => (
              <span key={i} className="w-0.5 bg-primary eq-bar" style={{ animationDelay: `${d}s`, height: "60%" }} />
            ))}
          </div>
        )}
        <FavoriteButton track={track} className="absolute top-2 right-2 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:text-primary transition" />
      </div>
      <div className="font-medium text-sm truncate group-hover:text-primary transition">{track.title}</div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{track.artist}</span>
        {formatDuration(track.durationSeconds) && <span className="shrink-0 tabular-nums">{formatDuration(track.durationSeconds)}</span>}
      </div>
    </motion.div>
  );
}
