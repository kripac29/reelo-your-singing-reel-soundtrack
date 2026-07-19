import { createFileRoute } from "@tanstack/react-router";
import { usePlayer } from "@/lib/player-store";
import { useReels } from "@/lib/reels-store";
import { Play } from "lucide-react";
import { getTrackCover } from "@/lib/reel-utils";
import { ReelCover } from "@/components/ReelCover";

export const Route = createFileRoute("/app/recent")({ component: Recent });

function Recent() {
  const p = usePlayer();
  const { reels: saved } = useReels();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Recently Played</h1>
        <p className="text-muted-foreground mt-1">Pick up exactly where you stopped.</p>
      </header>
      <div className="glass rounded-2xl overflow-hidden">
        {saved.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">No saved reels yet — import an Instagram reel to build your recent history.</div>
        ) : (
          saved.map((t, i) => (
            <button
              key={t.id}
              onClick={() => p.play(t, saved)}
              className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition group text-left border-b border-white/5 last:border-0"
            >
              <span className="text-xs text-muted-foreground w-6 text-center">{i + 1}</span>
              <ReelCover src={getTrackCover(t)} alt={t.title} className="w-12 h-12 rounded-lg" fallbackLabel="Reel cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate group-hover:text-primary transition">{t.title}</div>
                <div className="text-xs text-muted-foreground truncate">{t.artist} · {t.mood ?? "Saved reel"}</div>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">{t.duration}</span>
              <div className="w-9 h-9 rounded-full gradient-brand grid place-items-center text-white opacity-0 group-hover:opacity-100 transition">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
