import { createFileRoute } from "@tanstack/react-router";
import { playlists } from "@/lib/mock-data";
import { PlaylistCard } from "@/components/PlaylistCard";
import { MusicCard } from "@/components/MusicCard";
import useSavedReels from "@/lib/saved-store";
import { getTrackCover } from "@/lib/reel-utils";

export const Route = createFileRoute("/app/library")({ component: Library });

function Library() {
  const { saved } = useSavedReels();

  const folderSummaries = playlists.map((playlist) => {
    const folderItems = saved.filter((track) => track.folderId === playlist.id);
    return {
      ...playlist,
      count: folderItems.length,
      cover: folderItems.length > 0 ? getTrackCover(folderItems[0]) : playlist.cover,
      thumbnails: folderItems.slice(0, 4).map(getTrackCover),
    };
  });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">My Scrapbook</h1>
        <p className="text-muted-foreground mt-1">Every reel you've ever saved, sorted your way.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {["All", "Folders", "Reels", "Creators", "Moods"].map((c, i) => (
          <button
            key={c}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              i === 0 ? "bg-primary text-primary-foreground" : "glass hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section>
        <h2 className="font-display text-xl font-bold mb-4">Your mood folders</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {folderSummaries.map((p) => (
            <PlaylistCard key={p.id} {...p} thumbnails={p.thumbnails} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4">All saved reels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {saved.length === 0 ? (
            <div className="text-sm text-muted-foreground">No saved reels yet — paste an Instagram reel link from the Save a reel screen.</div>
          ) : (
            saved.map((t) => <MusicCard key={t.id} track={t} queue={saved} />)
          )}
        </div>
      </section>
    </div>
  );
}
