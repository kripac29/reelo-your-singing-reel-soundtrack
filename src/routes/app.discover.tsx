import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Link2, Sparkles, Folder, Check } from "lucide-react";
import { playlists, moods, tracks } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";
import { ArrowDownToLine, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/discover")({ component: Import });

function Import() {
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState(playlists[0].id);
  const [mood, setMood] = useState(moods[0].name);
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSaved(true);
    setUrl("");
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Import & organize</h1>
        <p className="text-muted-foreground mt-1">Bring your saved Instagram singing reels into folders, creators, and moods.</p>
      </header>

      {/* Import card */}
      <section className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full gradient-brand opacity-25 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 text-primary">
              <ArrowDownToLine className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">From Instagram → Reelo</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-3">Save a reel once. Listen forever.</h2>
            <p className="text-muted-foreground mt-3">
              Import your saved singing reels, then file them into mood folders and creator bookmarks. No public catalog — just your personal collection.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Late Night folder", "Heartbreak folder", "Acoustic folder", "Bookmarks", "History"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs glass border border-white/10 text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">Smart suggestions</span>
            </div>
            <div className="text-sm text-muted-foreground mt-2">Based on what you’ve saved (not what’s “trending”).</div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tracks.slice(2, 8).map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="relative mt-5 grid gap-4">
          <label className="block">
            <div className="text-xs text-muted-foreground mb-2">Reel link</div>
            <div className="flex items-center gap-2 rounded-2xl bg-black/30 border border-white/10 focus-within:border-primary/60 transition px-4 py-3">
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://instagram.com/reel/…"
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5"><Folder className="w-3.5 h-3.5" /> Folder</div>
              <select value={folder} onChange={(e) => setFolder(e.target.value)} className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-primary/60">
                {playlists.map((p) => <option key={p.id} value={p.id} className="bg-background">{p.title}</option>)}
              </select>
            </label>
            <label className="block">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Mood tag</div>
              <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-primary/60">
                {moods.map((m) => <option key={m.name} value={m.name} className="bg-background">{m.name}</option>)}
              </select>
            </label>
          </div>

          <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full gradient-brand text-white text-sm font-medium shadow-[0_10px_30px_oklch(0.72_0.3_350/0.4)] hover:opacity-95 transition">
            {saved ? (<><Check className="w-4 h-4" /> Saved to your scrapbook</>) : (<>Save reel</>)}
          </button>
          <p className="text-xs text-muted-foreground">Tip: in Instagram, tap Share → Copy link, then paste it here.</p>
        </form>
      </section>

      {/* Suggestions inferred from saves */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-5">Mood folders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((m) => (
            <div key={m.name} className={`relative aspect-[4/3] rounded-2xl p-4 bg-gradient-to-br ${m.gradient} overflow-hidden cursor-pointer hover:scale-[1.02] transition`}>
              <span className="font-display text-xl font-bold">{m.name}</span>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl rotate-12 bg-black/30 backdrop-blur" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-5">Creators you bookmark</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artists.map((a) => (
            <div key={a.name} className="glass rounded-2xl overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="font-display font-bold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.followers} reels saved</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
