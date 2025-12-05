"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Station } from "../types";
import { MapPin, Trash2, Loader2, Star } from "lucide-react";
import { StationSearch } from "./station-search";
import { removeFavoriteStation } from "../actions/manage-favorites";

interface StationListProps {
  stations: Station[];
  onSelect: (station: Station) => void;
}

export function StationList({ stations: initialStations, onSelect }: StationListProps) {
  const router = useRouter();
  // Optimistic state for favorites
  const [stations, setStations] = useState(initialStations);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Get list of favorite extIds for the search component
  const favoriteExtIds = stations
    .map((s) => s.extId || s.id)
    .filter(Boolean) as string[];

  // Optimistic add - instantly show in UI
  const handleFavoriteAdded = useCallback((station: Station) => {
    setStations((prev) => {
      const extId = station.extId || station.id;
      
      // Check if already exists
      const exists = prev.some((s) => s.extId === extId);
      if (exists) return prev;
      
      // Add to beginning of list with extId as temporary id
      return [{ ...station, id: extId, extId }, ...prev];
    });
  }, []);

  // Optimistic remove
  const handleRemoveFavorite = useCallback(async (e: React.MouseEvent, station: Station) => {
    e.stopPropagation();
    
    const extId = station.extId || station.id;
    
    // Optimistic update - remove instantly
    setRemovingId(station.id);
    setStations((prev) => prev.filter((s) => s.extId !== extId && s.id !== station.id));

    // Save in background - use extId which works for both DB entries and optimistic ones
    await removeFavoriteStation(extId);
    setRemovingId(null);
    
    // Refresh server data in background
    router.refresh();
  }, [router]);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-medium text-gray-600">
        Where will you check in from?
      </h2>
      
      {/* Search input */}
      <StationSearch 
        onSelect={onSelect}
        favoriteExtIds={favoriteExtIds}
        onFavoriteAdded={handleFavoriteAdded}
      />

      {/* Favorite stations */}
      {stations.length > 0 ? (
      <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-yellow-500" fill="currentColor" />
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Favorites
            </p>
          </div>
          {stations.map((station) => {
            const isRemoving = removingId === station.id;

            return (
              <div
                key={station.id}
                className={`flex items-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all ${
                  isRemoving ? "opacity-50" : ""
                }`}
              >
          <button
            onClick={() => onSelect(station)}
                  className="flex-1 flex items-center gap-4 p-4 text-left active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-[#1734D8]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-[17px]">{station.name}</p>
                    {station.municipality && (
              <p className="text-sm text-gray-500">({station.municipality})</p>
                    )}
            </div>
          </button>
                
                {/* Remove from favorites button */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, station)}
                  disabled={isRemoving}
                  className="p-3 mr-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Remove from favorites"
                >
                  {isRemoving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            );
          })}
      </div>
      ) : (
        <p className="text-center text-gray-400 py-4">
          Search for a station and tap ⭐ to add it to favorites
        </p>
      )}
    </div>
  );
}
