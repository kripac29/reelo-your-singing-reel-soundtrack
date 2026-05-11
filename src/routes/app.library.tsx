import { createFileRoute } from "@tanstack/react-router";
import { playlists, tracks } from "@/lib/mock-data";
import { PlaylistCard } from "@/components/PlaylistCard";
import { MusicCard } from "@/components/MusicCard";

export const Route = createFileRoute("/app/library")({ component: Library });

function Library() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Your Library</h1>
        <p className="text-muted-foreground mt-1">Everything you've saved, in one calm place.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {["All", "Playlists", "Reels", "Artists", "Moods"].map((c, i) => (
          <button key={c} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${i === 0 ? "bg-primary text-primary-foreground" : "glass hover:bg-white/10"}`}>{c}</button>
        ))}
      </div>

      <section>
        <h2 className="font-display text-xl font-bold mb-4">Your Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {playlists.map((p) => <PlaylistCard key={p.id} {...p} />)}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4">Saved Reels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {tracks.map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}
        </div>
      </section>
    </div>
  );
}
