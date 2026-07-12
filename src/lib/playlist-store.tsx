import { useCallback, useEffect, useState } from "react";
import { defaultPlaylists, type Playlist } from "./mock-data";

const KEY = "reelo:playlists:v1";
const PLACEHOLDER_IDS = new Set(["p1", "p2", "p3", "p4", "p5", "p6"]);

function readStored(): Playlist[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Playlist[];
    return parsed.filter((playlist) => !PLACEHOLDER_IDS.has(playlist.id));
  } catch (e) {
    return [];
  }
}

function writeStored(value: Playlist[]) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

const store = {
  data: [] as Playlist[],
  listeners: new Set<(value: Playlist[]) => void>(),
  init() {
    if (this.data.length === 0) {
      this.data = readStored();
    }
  },
  notify() {
    for (const listener of this.listeners) {
      listener(this.data);
    }
  },
  subscribe(fn: (value: Playlist[]) => void) {
    this.listeners.add(fn);
    fn(this.data);
    return () => {
      this.listeners.delete(fn);
    };
  },
  add(playlist: Playlist) {
    this.data = [...this.data, playlist];
    writeStored(this.data);
    this.notify();
  },
};

store.init();

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => store.data.length ? store.data : defaultPlaylists);

  useEffect(() => {
    store.init();
    const unsubscribe = store.subscribe((value) => setPlaylists(value));
    return unsubscribe;
  }, []);

  const addPlaylist = useCallback((playlist: Playlist) => {
    store.add(playlist);
  }, []);

  return { playlists, addPlaylist } as const;
}

export type { Playlist };
