import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Link2, AlertCircle, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useReels } from "@/lib/reels-store";
import { usePlaylists } from "@/lib/playlist-store";
import { importReelAudio } from "@/lib/audioApi";

export const Route = createFileRoute("/app/discover")({ component: Import });

function Import() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [newPlaylistError, setNewPlaylistError] = useState<string | null>(null);
  const [pendingReel, setPendingReel] = useState<{
    sourceUrl: string;
    title: string;
    creator: string;
    audioUrl: string;
    thumbnailUrl?: string | null;
    thumbnail?: string | null;
    duration: number | null;
  } | null>(null);

  const { addReel } = useReels();
  const { playlists, addPlaylist } = usePlaylists();

  const selectedPlaylist = playlists.find((playlist) => playlist.id === selectedPlaylistId) ?? null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await importReelAudio({ instagramUrl: url.trim() });
      setPendingReel({
        sourceUrl: url.trim(),
        title: result.title,
        creator: result.creator,
        audioUrl: result.audioUrl,
        thumbnailUrl: result.thumbnailUrl ?? result.thumbnail,
        duration: result.duration,
      });
      setSelectedPlaylistId(null);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import reel");
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setNewPlaylistError("Playlist name is required");
      return;
    }

    const playlistCover = playlists[Math.floor(Math.random() * playlists.length)]?.cover ?? "";
    const playlist = {
      id: `playlist_${Date.now()}`,
      title: newPlaylistName.trim(),
      desc: newPlaylistDesc.trim() || "New playlist",
      cover: playlistCover,
      count: 0,
    };

    try {
      const created = await addPlaylist(playlist);
      setSelectedPlaylistId(created.id);
      setIsCreatingPlaylist(false);
      setNewPlaylistName("");
      setNewPlaylistDesc("");
      setNewPlaylistError(null);
    } catch (error) {
      setNewPlaylistError(error instanceof Error ? error.message : "Unable to create playlist");
    }
  };

  const saveToPlaylist = async () => {
    if (!pendingReel || !selectedPlaylistId) return;

    try {
      await addReel({
        id: `reel_${Date.now()}`,
        title: pendingReel.title,
        artist: pendingReel.creator,
        cover: pendingReel.thumbnailUrl || "",
        duration: pendingReel.duration
          ? `${Math.floor(pendingReel.duration / 60)}:${String(pendingReel.duration % 60).padStart(2, "0")}`
          : "0:00",
        mood: "",
        savedAt: new Date().toISOString(),
        sourceUrl: pendingReel.sourceUrl,
        folderId: selectedPlaylistId,
        audioUrl: pendingReel.audioUrl,
        durationSeconds: pendingReel.duration ?? undefined,
        thumbnailUrl: pendingReel.thumbnailUrl ?? undefined,
        thumbnail: pendingReel.thumbnailUrl ?? undefined,
      });

      setIsModalOpen(false);
      setPendingReel(null);
      setUrl("");
      toast.success("Saved to playlist", {
        description: `Added to ${selectedPlaylist?.title ?? "your playlist"}`,
      });
      navigate({ to: "/app/library" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save reel");
    }
  };

  return (
    <>
      <div className="space-y-12">
        <header>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Save a reel</h1>
          <p className="text-muted-foreground mt-1">Paste an Instagram singing reel and tuck it into your scrapbook.</p>
        </header>

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

            <button type="submit" disabled={loading} className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full gradient-brand text-white text-sm font-medium shadow-[0_10px_30px_oklch(0.72_0.3_350/0.4)] hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <><Loader className="w-4 h-4 animate-spin" /> Importing...</>
              ) : (
                "Save reel"
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Tip: in Instagram, tap Share → Copy link, then paste it here.</p>
          </form>
        </section>

      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setPendingReel(null);
            setIsCreatingPlaylist(false);
            setNewPlaylistError(null);
          }
        }}
      >
        <DialogContent className="max-w-[780px] rounded-3xl p-8 glass-strong">
          <DialogHeader>
            <DialogTitle>Save to Playlist</DialogTitle>
            <DialogDescription>Choose a playlist or create a new one for this reel.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-6">
            <div className="space-y-3">
              {playlists.map((playlist) => {
                const isSelected = selectedPlaylistId === playlist.id;
                return (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                    className={`w-full rounded-3xl border px-5 py-4 text-left transition ${isSelected ? "border-primary bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-white">{playlist.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{playlist.desc}</p>
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-white"}`}>
                        {isSelected ? "✓ Selected" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCreatingPlaylist(true);
                setNewPlaylistError(null);
              }}
              className="w-full rounded-3xl border border-dashed border-white/20 bg-white/5 px-5 py-4 text-left text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              + New Playlist
            </button>

            {isCreatingPlaylist && (
              <div className="glass rounded-3xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Playlist Name</label>
                    <input
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Enter playlist name"
                      className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-primary/60"
                    />
                  </div>
                  {newPlaylistError && <div className="text-sm text-red-400">{newPlaylistError}</div>}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Description</label>
                    <textarea
                      value={newPlaylistDesc}
                      onChange={(e) => setNewPlaylistDesc(e.target.value)}
                      placeholder="Optional description"
                      rows={3}
                      className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-primary/60"
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPlaylist(false);
                        setNewPlaylistName("");
                        setNewPlaylistDesc("");
                        setNewPlaylistError(null);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={createPlaylist}
                      className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                      Create Playlist
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setPendingReel(null);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveToPlaylist}
                disabled={!pendingReel || !selectedPlaylistId}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save to playlist
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
