import { createFileRoute, Link } from "@tanstack/react-router";
import { playlists } from "@/lib/mock-data";
import useSavedReels from "@/lib/saved-store";
import { Play, Shuffle, Heart, MoreHorizontal, GripVertical, Clock } from "lucide-react";
import { usePlayer } from "@/lib/player-store";
import { getTrackCover } from "@/lib/reel-utils";
import { ReelCover } from "@/components/ReelCover";

export const Route = createFileRoute("/app/playlist/$id")({ component: PlaylistPage });

function PlaylistPage() {
  const { id } = Route.useParams();
  const playlist = playlists.find((p) => p.id === id) ?? playlists[0];
  const { saved } = useSavedReels();
  const list = saved.filter((t) => t.folderId === id);
  const count = list.length;
  const p = usePlayer();
  const playlistCover = list.length > 0 ? getTrackCover(list[0]) : playlist.cover;

  return (
    <div className="space-y-8">
      <div className="relative -mx-4 lg:-mx-8 -mt-6 px-4 lg:px-8 pt-10 pb-8 overflow-hidden">
        <ReelCover src={playlistCover} alt={playlist.title} className="absolute inset-0 w-full h-full" fallbackLabel="Playlist cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="relative flex flex-col md:flex-row gap-6 items-end">
          <ReelCover src={playlistCover} alt={playlist.title} className="w-44 h-44 md:w-56 md:h-56 rounded-2xl shadow-[0_30px_80px_-20px_oklch(0_0_0/0.7)]" fallbackLabel="Playlist cover" />
          <div className="min-w-0">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Playlist</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 leading-none">{playlist.title}</h1>
            <p className="text-muted-foreground mt-3">{playlist.desc}</p>
            <div className="text-xs text-muted-foreground mt-2">{count} reels · ~38 min</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => p.play(list[0], list)} className="w-14 h-14 rounded-full gradient-brand grid place-items-center text-white shadow-[0_15px_40px_oklch(0.72_0.3_350/0.5)] hover:scale-105 transition">
          <Play className="w-6 h-6 ml-0.5" />
        </button>
        <button onClick={p.toggleShuffle} className={`p-3 rounded-full glass hover:bg-white/10 ${p.shuffle ? "text-primary" : ""}`}><Shuffle className="w-5 h-5" /></button>
        <button className="p-3 rounded-full glass hover:bg-white/10 text-muted-foreground hover:text-primary"><Heart className="w-5 h-5" /></button>
        <button className="p-3 rounded-full glass hover:bg-white/10 text-muted-foreground"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[24px_40px_1fr_1fr_auto] gap-4 px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground border-b border-white/5">
          <span>#</span><span></span><span>Title</span><span className="hidden md:block">Mood</span><Clock className="w-4 h-4" />
        </div>
        {list.map((t, i) => {
          const active = p.current?.id === t.id;
          return (
            <div key={t.id} className={`grid grid-cols-[24px_40px_1fr_1fr_auto] gap-4 px-4 py-2.5 items-center group cursor-pointer transition ${active ? "bg-primary/10" : "hover:bg-white/5"}`} onClick={() => p.play(t, list)}>
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="group-hover:hidden">{i + 1}</span>
                <Play className="w-3.5 h-3.5 hidden group-hover:block text-primary" />
              </div>
              <ReelCover src={getTrackCover(t)} alt={t.title} className="w-9 h-9 rounded-md" fallbackLabel="Reel" />
              <div className="min-w-0">
                <div className={`text-sm truncate ${active ? "text-primary" : ""}`}>{t.title}</div>
                <div className="text-xs text-muted-foreground truncate">{t.artist}</div>
              </div>
              <span className="hidden md:block text-xs text-muted-foreground">{t.mood}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                {t.duration}
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/app/library" className="text-sm text-muted-foreground hover:text-primary transition">← Back to library</Link>
    </div>
  );
}
