import { Heart } from "lucide-react";
import { useState } from "react";
import type { Track } from "@/lib/mock-data";
import { useReels } from "@/lib/reels-store";

export function FavoriteButton({ track, className = "" }: { track: Track; className?: string }) {
  const { toggleFavorite } = useReels();
  const [isUpdating, setIsUpdating] = useState(false);
  const isFavorite = Boolean(track.isFavorite);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await toggleFavorite(track.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUpdating}
      aria-label={isFavorite ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
      className={className}
    >
      <Heart className={isFavorite ? "fill-current text-primary" : ""} />
    </button>
  );
}
