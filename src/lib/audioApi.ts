export type ImportReelRequest = {
  instagramUrl: string;
  folderId?: string;
};

export type ImportReelResponse = {
  success: true;
  title: string;
  creator: string;
  audioUrl: string;
  thumbnail?: string | null;
  thumbnailUrl?: string | null;
  duration: number | null;
  folderId: string | null;
};

export async function importReelAudio(request: ImportReelRequest): Promise<ImportReelResponse> {
  const resp = await fetch("https://reelo-your-singing-reel-soundtrack.onrender.com/api/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const payload = await resp.json().catch(() => null);
    throw new Error(payload?.error || "Failed to import reel audio");
  }

  return resp.json();
}
