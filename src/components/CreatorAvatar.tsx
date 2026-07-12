import { User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function initialsFromName(name: string) {
  const cleaned = name.replace(/^@/, "").trim();
  const parts = cleaned.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function CreatorAvatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const imageUrl = src?.trim() ? src : undefined;
  const initials = initialsFromName(name);

  return (
    <div className={cn("relative overflow-hidden rounded-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 text-white shadow-sm", className)}>
      {imageUrl && !error ? (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
          {initials || <User className="w-5 h-5" />}
        </div>
      )}
    </div>
  );
}
