"use client";

import { useState, useEffect, useCallback } from "react";

interface FavoriteButtonProps {
  id: string;
  type: "invoice" | "proposal" | "contract";
  size?: "sm" | "md";
  onToggle?: (favorited: boolean) => void;
}

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("invoiceforge-favorites");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setFavorites(favs: string[]) {
  localStorage.setItem("invoiceforge-favorites", JSON.stringify(favs));
}

export function getFavoriteCount(): number {
  return getFavorites().length;
}

export function isFavorited(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    setFavorites(favs);
    return false;
  } else {
    favs.push(id);
    setFavorites(favs);
    return true;
  }
}

export default function FavoriteButton({
  id,
  size = "md",
  onToggle,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited(id));
  }, [id]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newState = toggleFavorite(id);
      setFavorited(newState);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
      onToggle?.(newState);

      // Dispatch custom event for badge updates
      window.dispatchEvent(new CustomEvent("favorites-changed"));
    },
    [id, onToggle]
  );

  const sz = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSz = size === "sm" ? 14 : 18;

  return (
    <button
      onClick={handleClick}
      className={`${sz} rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
        favorited
          ? "text-amber-400 hover:text-amber-300"
          : "text-zinc-600 hover:text-zinc-400"
      } ${animating ? "scale-125" : ""}`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={favorited ? "Unfavorite" : "Favorite"}
    >
      <svg
        width={iconSz}
        height={iconSz}
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={favorited ? 0 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${animating ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : ""}`}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}
