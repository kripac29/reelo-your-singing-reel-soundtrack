import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { tracks, playlists, moods, artists } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { Link } from "@tanstack/react-router";
import { Bookmark, FolderHeart, History, Plus } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const recent = tracks.slice(0, 6);
  const totalSaved = tracks.length + 142; // mock
  const totalCreators = artists.length + 21;

  return (
    <div className="space-y-12">
      {/* Personal greeting + scrapbook stats */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{greet}</h1>
            <p className="text-muted-foreground mt-1">Your saved singing reels — organized like a calm music scrapbook.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/app/discover"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-brand text-white text-sm font-semibold shadow-[0_15px_40px_-10px_oklch(0.72_0.3_350/0.6)]"
            >
              <Plus className="w-4 h-4" /> Import a reel
            </Link>
            <Link
              to="/app/library"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-primary/40 transition text-sm"
            >
              <FolderHeart className="w-4 h-4" /> Your folders
            </Link>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <Link to="/app/recent" className="glass rounded-2xl p-4 hover:bg-white/5 transition group">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <History className="w-4 h-4" /> Continue listening
            </div>
            <div className="mt-2 font-display text-lg font-semibold">Pick up where you stopped</div>
            <div className="text-sm text-muted-foreground mt-0.5">Your last played reels, in order.</div>
          </Link>
          <Link to="/app/favorites" className="glass rounded-2xl p-4 hover:bg-white/5 transition group">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Bookmark className="w-4 h-4" /> Bookmarks
            </div>
            <div className="mt-2 font-display text-lg font-semibold">Creators & reels you saved</div>
            <div className="text-sm text-muted-foreground mt-0.5">Your quick-grab favorites.</div>
          </Link>
          <Link to="/app/library" className="glass rounded-2xl p-4 hover:bg-white/5 transition group">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <FolderHeart className="w-4 h-4" /> Mood folders
            </div>
            <div className="mt-2 font-display text-lg font-semibold">Your vibe boards</div>
            <div className="text-sm text-muted-foreground mt-0.5">Late night, heartbreak, dreamy…</div>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tracks.slice(0, 8).map((t) => (
            <button key={t.id} className="flex items-center gap-3 glass rounded-xl p-2 pr-4 group hover:bg-white/5 transition">
              <img src={t.cover} alt="" className="w-14 h-14 rounded-lg object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate group-hover:text-primary transition">{t.title}</div>
                <div className="text-xs text-muted-foreground truncate">{t.artist} · saved {t.savedAt}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      <Section title="Recently saved reels" subtitle="The ones you keep coming back to">
        <Grid>{tracks.slice(0, 6).map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}</Grid>
      </Section>

      <Section title="Mood folders" subtitle="Save reels into vibe boards">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((m) => (
            <motion.button key={m.name} whileHover={{ y: -3 }} className={`relative aspect-[4/3] rounded-2xl overflow-hidden p-4 text-left bg-gradient-to-br ${m.gradient}`}>
              <span className="font-display text-xl font-bold drop-shadow-md">{m.name}</span>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl rotate-12 bg-black/30 backdrop-blur" />
            </motion.button>
          ))}
        </div>
      </Section>

      <Section title="Bookmarked creators" subtitle="Singers you save again and again">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {artists.map((a) => (
            <div key={a.name} className="glass rounded-2xl p-5 text-center group">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary transition">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="mt-4 font-medium">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.followers}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Your folders" subtitle="Collections that feel like Pinterest boards">
        <Grid>{playlists.map((p) => <PlaylistCard key={p.id} {...p} />)}</Grid>
      </Section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span></div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <button className="text-xs text-muted-foreground hover:text-primary transition uppercase tracking-widest">See all</button>
      </div>
      {children}
    </section>
  );
}
