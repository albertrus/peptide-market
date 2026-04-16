'use client';
import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  vendorId: string;
}

export default function FavoriteButton({ vendorId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(vendorId));
  }, [vendorId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updated: string[];
    if (favorites.includes(vendorId)) {
      updated = favorites.filter((id) => id !== vendorId);
    } else {
      updated = [...favorites, vendorId];
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(updated.includes(vendorId));
  };

  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={`p-2 rounded-full transition-colors ${
        isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    </button>
  );
}
