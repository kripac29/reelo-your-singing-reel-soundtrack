import type { Track } from "./mock-data";

export function getTrackCover(track: Track) {
  return track.thumbnailUrl?.trim() || track.thumbnail?.trim() || track.cover;
}

export function normalizeCreatorName(raw?: string) {
  if (!raw) return "Unknown";
  return raw.replace(/^(?:Video\s+by|By)\s+/i, "").trim();
}

export function normalizeTrackTitle(raw?: string) {
  if (!raw) return "Untitled reel";
  return raw.replace(/^(?:Video\s+by|By)\s+/i, "").trim();
}
