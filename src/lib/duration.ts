export function formatDuration(seconds: number | null | undefined): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds <= 0) return null;

  const roundedSeconds = Math.round(seconds);
  return `${Math.floor(roundedSeconds / 60)}:${String(roundedSeconds % 60).padStart(2, "0")}`;
}

export function formatTotalDuration(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  const roundedSeconds = Math.round(seconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;
  const parts = [
    hours > 0 ? `${hours} hr` : null,
    minutes > 0 ? `${minutes} min` : null,
    remainingSeconds > 0 ? `${remainingSeconds} sec` : null,
  ].filter((part): part is string => Boolean(part));

  return parts.join(" ") || null;
}
