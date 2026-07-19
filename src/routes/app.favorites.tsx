import { createFileRoute } from "@tanstack/react-router";
import { MusicCard } from "@/components/MusicCard";
import { useReels } from "@/lib/reels-store";

export const Route = createFileRoute("/app/favorites")({ component: Favorites });

function Favorites() {
  const { reels: saved } = useReels();
  const favs = saved.slice(0, 6);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Favorites</h1>
        <p className="text-muted-foreground mt-1">Your hand-picked, can't-skip reels.</p>
      </header>
      {favs.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">Save some reels and they'll appear here as favorites.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {favs.map((t) => <MusicCard key={t.id} track={t} queue={favs} />)}
        </div>
      )}
    </div>
  );
}
