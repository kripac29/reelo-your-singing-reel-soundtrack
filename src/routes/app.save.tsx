import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDownToLine, Instagram, Link2, Loader2 } from "lucide-react";

import { usePlaylists } from "@/lib/playlist-store";
import { usePlayer } from "@/lib/player-store";
import { useReels } from "@/lib/reels-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/app/save")({ component: SaveReel });

function SaveReel() {
  const navigate = useNavigate();
  const { addReel, reels } = useReels();
  const player = usePlayer();
  const { playlists } = usePlaylists();
  const [url, setUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [folderId, setFolderId] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!playlists.length) return;

    if (!folderId || !playlists.some((playlist) => playlist.id === folderId)) {
      setFolderId(playlists[0].id);
    }
  }, [folderId, playlists]);

  const folderOptions = useMemo(
    () => playlists.map((p) => ({ id: p.id, title: p.title })),
    [playlists],
  );

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Save a reel</h1>
        <p className="text-muted-foreground mt-1">Paste an Instagram singing reel and tuck it into your scrapbook.</p>
      </header>

      <section className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full gradient-brand opacity-20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-primary">
            <Instagram className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-semibold">Import from Instagram</span>
          </div>

          <form
            className="mt-6 space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!url.trim()) {
                toast.error("Paste a reel link first.");
                return;
              }
              if (!mood.trim()) {
                toast.error("Add a mood tag.");
                return;
              }

              setSaving(true);
              let resolvedAudio: string | undefined = audioUrl.trim() || undefined;

              if (!resolvedAudio) {
                try {
                  const res = await fetch("/api/reel-import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: url.trim() }),
                  });
                  const data = (await res.json()) as { audioUrl?: string; error?: string; detail?: string };
                  if (!res.ok) {
                    toast.error(data.error ?? "Could not import audio", {
                      description: data.detail?.slice(0, 400),
                    });
                    setSaving(false);
                    return;
                  }
                  if (!data.audioUrl) {
                    toast.error("Import returned no audio URL.");
                    setSaving(false);
                    return;
                  }
                  resolvedAudio = data.audioUrl;
                } catch {
                  toast.error("Import failed (network or server).", {
                    description: "Run `npm run dev` from the project root, restart the terminal after installing yt-dlp/ffmpeg, then try again.",
                  });
                  setSaving(false);
                  return;
                }
              }

              const newReel = {
                title: "Saved Instagram reel",
                artist: "Creator",
                cover: playlists.find((p) => p.id === folderId)?.cover ?? playlists[0]?.cover ?? "",
                audioUrl: resolvedAudio,
                folderId,
                sourceUrl: url.trim(),
                savedAt: "just now",
                duration: "—",
                mood: mood.trim(),
              };
              try {
                const createdReel = await addReel(newReel);
                player.play(createdReel, [createdReel, ...reels]);

              toast.success("Saved and playing", {
                description: `Folder: ${folderOptions.find((f) => f.id === folderId)?.title ?? "—"} · Mood: ${mood.trim()}`,
              });
              setUrl("");
              setAudioUrl("");
              setMood("");
              setSaving(false);
                navigate({ to: "/app/library" });
              } catch (saveError) {
                toast.error(saveError instanceof Error ? saveError.message : "Unable to save reel");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Reel link</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-black/20 border border-white/10 px-4 py-3 focus-within:border-primary/60 transition">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  inputMode="url"
                />
                <ArrowDownToLine className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Audio URL (optional)</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-black/20 border border-white/10 px-4 py-3 focus-within:border-primary/60 transition">
                <span className="text-xs text-muted-foreground">mp3</span>
                <input
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://.../audio.mp3"
                  className="flex-1 bg-transparent outline-none text-sm"
                  inputMode="url"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Leave empty to import audio automatically in dev (requires <code className="text-foreground/90">yt-dlp</code> +{" "}
                <code className="text-foreground/90">ffmpeg</code> on PATH — restart terminal after <code className="text-foreground/90">winget install</code>).
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <span className="inline-flex w-6 h-6 rounded-full bg-white/5 border border-white/10 items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary/70" />
                  </span>
                  Folder
                </div>
                <div className="mt-2">
                  <Select value={folderId} onValueChange={setFolderId}>
                    <SelectTrigger className="h-12 rounded-2xl bg-black/20 border border-white/10">
                      <SelectValue placeholder="Choose a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {folderOptions.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Mood tag</label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-black/20 border border-white/10 px-4 py-3 focus-within:border-primary/60 transition">
                  <input
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="e.g. Late Night, Heartbreak, Cozy, Gym..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 rounded-2xl gradient-brand text-white font-semibold shadow-[0_20px_60px_-15px_oklch(0.72_0.3_350/0.6)] hover:scale-[1.01] transition disabled:opacity-60 disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Importing…
                </>
              ) : (
                "Save reel"
              )}
            </button>

            <div className="text-xs text-muted-foreground text-center">
              Tip: in Instagram, tap Share → Copy link, then paste it here.
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

