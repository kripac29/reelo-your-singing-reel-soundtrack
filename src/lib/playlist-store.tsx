import { useCallback, useEffect, useState } from "react";

export type Playlist = {
  id: string;
  title: string;
  desc: string;
  cover: string;
  count: number;
};

const API_BASE_URL = "https://reelo-your-singing-reel-soundtrack.onrender.com/api";

function mapPlaylist(item: any): Playlist {
  return {
    id: item?._id ?? item?.id ?? "",
    title: item?.name ?? item?.title ?? "Untitled playlist",
    desc: item?.description ?? item?.desc ?? "",
    cover: item?.coverImage ?? item?.cover ?? "",
    count: typeof item?.count === "number" ? item.count : 0,
  };
}

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchPlaylistsFromApi(): Promise<Playlist[]> {
  const response = await fetch(`${API_BASE_URL}/playlists`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to load playlists");
  }

  const data = await response.json();
  return Array.isArray(data?.playlists) ? data.playlists.map(mapPlaylist) : [];
}

async function createPlaylistOnApi(playlist: Playlist): Promise<Playlist> {
  const response = await fetch(`${API_BASE_URL}/playlists`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      name: playlist.title,
      description: playlist.desc,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Unable to create playlist");
  }

  const data = await response.json();
  return mapPlaylist(data?.playlist);
}

async function deletePlaylistOnApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Unable to delete playlist");
  }
}

const store = {
  data: [] as Playlist[],
  listeners: new Set<(value: Playlist[]) => void>(),
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
  async load() {
    try {
      this.data = await fetchPlaylistsFromApi();
    } catch (error) {
      this.data = [];
    }
    this.notify();
  },
  async add(playlist: Playlist) {
    const created = await createPlaylistOnApi(playlist);
    this.data = [created, ...this.data.filter((item) => item.id !== created.id)];
    this.notify();
    return created;
  },
  async remove(id: string) {
    await deletePlaylistOnApi(id);
    this.data = this.data.filter((playlist) => playlist.id !== id);
    this.notify();
  },
};

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => store.data);

  useEffect(() => {
    let active = true;

    const loadPlaylists = async () => {
      await store.load();
      if (!active) return;
      setPlaylists(store.data);
    };

    void loadPlaylists();

    const unsubscribe = store.subscribe((value) => {
      if (!active) return;
      setPlaylists(value);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const addPlaylist = useCallback(async (playlist: Playlist) => {
    return store.add(playlist);
  }, []);

  const deletePlaylist = useCallback(async (id: string) => {
    await store.remove(id);
  }, []);

  return { playlists, addPlaylist, deletePlaylist } as const;
}
