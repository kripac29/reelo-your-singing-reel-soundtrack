import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Link2, Sparkles, Folder, Check } from "lucide-react";
import { playlists, moods, tracks } from "@/lib/mock-data";
import { MusicCard } from "@/components/MusicCard";

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
        <h1 className="font-display text-3xl md:text-4xl font-bold">Save a reel</h1>
        <p className="text-muted-foreground mt-1">Paste an Instagram singing reel and tuck it into your scrapbook.</p>
      </header>

      {/* Import card */}
      <section className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full gradient-brand opacity-25 blur-3xl" />
        <div className="relative flex items-center gap-3 text-primary">
          <Instagram className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-semibold">Import from Instagram</span>
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
        <h2 className="font-display text-2xl font-bold">Suggested folders for what you've been saving</h2>
        <p className="text-sm text-muted-foreground mt-0.5 mb-5">Auto-grouped by mood and creator</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tracks.slice(0, 4).map((t) => <MusicCard key={t.id} track={t} queue={tracks} />)}
        </div>
      </section>
    </div>
  );
}
