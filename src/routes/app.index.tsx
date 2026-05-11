import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { tracks, playlists, moods, artists } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { PlaylistCard } from "@/components/PlaylistCard";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-12">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold">{greet}</h1>
        <p className="text-muted-foreground mt-1">Pick up where you left off — or wander somewhere new.</p>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tracks.slice(0, 8).map((t) => (
            <button key={t.id} className="flex items-center gap-3 glass rounded-xl p-2 pr-4 group hover:bg-white/5 transition">
              <img src={t.cover} alt="" className="w-14 h-14 rounded-lg object-cover" loading="lazy" />
              <div className="text-left min-w-0">
                <div className="text-sm font-medium truncate group-hover:text-primary transition">{t.title}</div>
                <div className="text-xs text-muted-foreground truncate">{t.artist}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      <Section title="Trending Covers" subtitle="What everyone's saving this week">
        <Grid>{tracks.slice(0, 6).map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}</Grid>
      </Section>

      <Section title="Mood Playlists" subtitle="One tap, instant vibe">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((m) => (
            <motion.button key={m.name} whileHover={{ y: -3 }} className={`relative aspect-[4/3] rounded-2xl overflow-hidden p-4 text-left bg-gradient-to-br ${m.gradient}`}>
              <span className="font-display text-xl font-bold drop-shadow-md">{m.name}</span>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl rotate-12 bg-black/30 backdrop-blur" />
            </motion.button>
          ))}
        </div>
      </Section>

      <Section title="Favorite Artists" subtitle="Singers you keep coming back to">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {artists.map((a) => (
            <div key={a.name} className="glass rounded-2xl p-5 text-center group">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary transition">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="mt-4 font-medium">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.followers} reels saved</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Made for You" subtitle="Curated from your taste">
        <Grid>{playlists.map((p) => <PlaylistCard key={p.id} {...p} />)}</Grid>
      </Section>
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

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">{children}</div>;
}
