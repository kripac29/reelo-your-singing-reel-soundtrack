import { apiFetch, getApiError } from "@/lib/api";

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
  const resp = await apiFetch("/import", {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    throw await getApiError(resp, "Failed to import reel audio");
  }

  return resp.json();
}
