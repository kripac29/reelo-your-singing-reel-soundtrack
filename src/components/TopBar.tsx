import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, LogOut, ListMusic, Music2, UserRound, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { useReels } from "@/lib/reels-store";
import { usePlaylists } from "@/lib/playlist-store";
import { usePlayer } from "@/lib/player-store";
import { normalizeCreatorName } from "@/lib/reel-utils";

function normalized(value?: string) {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function creatorForReel(reel: { title: string; artist: string }) {
  const artist = normalizeCreatorName(reel.artist);
  return artist && normalized(artist) !== "instagram"
    ? artist
    : normalizeCreatorName(reel.title);
}

export function TopBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { reels } = useReels();
  const { playlists } = usePlaylists();
  const player = usePlayer();
  const [query, setQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTerm = normalized(query);

  const { reelResults, creatorResults, playlistResults } = useMemo(() => {
    if (!searchTerm) return { reelResults: [], creatorResults: [], playlistResults: [] };

    const matchingReels = reels.filter((reel) => {
      const creator = creatorForReel(reel);
      return [reel.title, reel.artist, creator].some((value) => normalized(value).includes(searchTerm));
    });

    const creators = new Map<string, typeof reels>();
    reels.forEach((reel) => {
      const creator = creatorForReel(reel);
      if (!creator) return;
      const key = normalized(creator);
      const creatorReels = creators.get(key) ?? [];
      creatorReels.push(reel);
      creators.set(key, creatorReels);
    });

    const matchingCreators = Array.from(creators.entries())
      .filter(([creator, creatorReels]) =>
        creator.includes(searchTerm) || creatorReels.some((reel) => normalized(reel.artist).includes(searchTerm)),
      )
      .map(([creator, creatorReels]) => ({ name: creatorReels[0] ? creatorForReel(creatorReels[0]) : creator, reels: creatorReels }));

    return {
      reelResults: selectedCreator
        ? matchingReels.filter((reel) => normalized(creatorForReel(reel)) === normalized(selectedCreator))
        : matchingReels,
      creatorResults: matchingCreators,
      playlistResults: playlists.filter((playlist) => normalized(playlist.title).includes(searchTerm)),
    };
  }, [playlists, reels, searchTerm, selectedCreator]);

  const hasResults = reelResults.length > 0 || creatorResults.length > 0 || playlistResults.length > 0;

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setQuery("");
        setSelectedCreator(null);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      // The local session is cleared even when the server cannot be reached.
      navigate({ to: "/login" });
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-border/50">
      <div className="flex items-center gap-3 px-4 lg:px-8 py-3">
        <div ref={searchRef} className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedCreator(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setQuery("");
                setSelectedCreator(null);
                event.currentTarget.blur();
              }
            }}
            placeholder="Search your saved reels, creators, moods..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-white/10 transition"
          />
          {searchTerm && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-[min(32rem,calc(100vh-7rem))] overflow-y-auto rounded-2xl border border-white/10 bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
              {selectedCreator && (
                <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                  <span>Reels by {selectedCreator}</span>
                  <button onClick={() => setSelectedCreator(null)} className="rounded p-1 hover:bg-white/10" aria-label="Show all search results">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {!hasResults ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</div>
              ) : (
                <div className="space-y-3">
                  {reelResults.length > 0 && (
                    <ResultGroup label="Reels">
                      {reelResults.map((reel) => (
                        <button
                          key={reel.id}
                          onClick={() => {
                            player.play(reel, reels);
                            setQuery("");
                            setSelectedCreator(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/10"
                        >
                          <Music2 className="h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{reel.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">{reel.artist}</span>
                          </span>
                        </button>
                      ))}
                    </ResultGroup>
                  )}
                  {!selectedCreator && creatorResults.length > 0 && (
                    <ResultGroup label="Creators">
                      {creatorResults.map((creator) => (
                        <button
                          key={normalized(creator.name)}
                          onClick={() => setSelectedCreator(creator.name)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/10"
                        >
                          <UserRound className="h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{creator.name}</span>
                            <span className="block text-xs text-muted-foreground">{creator.reels.length} saved {creator.reels.length === 1 ? "reel" : "reels"}</span>
                          </span>
                        </button>
                      ))}
                    </ResultGroup>
                  )}
                  {!selectedCreator && playlistResults.length > 0 && (
                    <ResultGroup label="Playlists">
                      {playlistResults.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => {
                            navigate({ to: "/app/playlist/$id", params: { id: playlist.id } });
                            setQuery("");
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/10"
                        >
                          <ListMusic className="h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{playlist.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">{playlist.count} saved {playlist.count === 1 ? "reel" : "reels"}</span>
                          </span>
                        </button>
                      ))}
                    </ResultGroup>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <button className="p-2.5 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition">
          <Bell className="w-4 h-4" />
        </button>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:border-primary/60 hover:text-primary transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}
