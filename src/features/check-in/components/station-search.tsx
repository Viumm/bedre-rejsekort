"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, X, Star } from "lucide-react";
import { searchStations } from "../actions/search-stations";
import { addFavoriteStation } from "../actions/manage-favorites";
import type { Station } from "../types";

interface StationSearchProps {
  onSelect: (station: Station) => void;
  placeholder?: string;
  favoriteExtIds?: string[];
  onFavoriteAdded?: (station: Station) => void;
}

export function StationSearch({ 
  onSelect, 
  placeholder = "Search for station...",
  favoriteExtIds = [],
  onFavoriteAdded,
}: StationSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingFavoriteId, setAddingFavoriteId] = useState<string | null>(null);
  // Optimistic: track locally added favorites
  const [optimisticFavorites, setOptimisticFavorites] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchStations(searchQuery);
      
      if (result.success) {
        const stations: Station[] = result.stations.map((s) => ({
          id: s.id,
          name: s.name,
          extId: s.extId,
          coordinates: s.coordinates,
          municipality: extractMunicipality(s.name),
        }));
        setResults(stations);
        setIsOpen(stations.length > 0);
      } else {
        setError(result.error || "Search failed");
        setResults([]);
      }
    } catch {
      setError("An error occurred while searching");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  }, [handleSearch]);

  const handleSelect = useCallback((station: Station) => {
    const cleanedStation = {
      ...station,
      name: cleanStationName(station.name),
    };
    setQuery(cleanedStation.name);
    setIsOpen(false);
    setResults([]);
    onSelect(cleanedStation);
  }, [onSelect]);

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setError(null);
    inputRef.current?.focus();
  }, []);

  const handleAddFavorite = useCallback(async (e: React.MouseEvent, station: Station) => {
    e.stopPropagation();
    
    const extId = station.extId || station.id;
    
    // Optimistic update - instantly mark as favorite
    setOptimisticFavorites((prev) => [...prev, extId]);
    setAddingFavoriteId(extId);

    const cleanedStation = {
      ...station,
      name: cleanStationName(station.name),
    };

    // Save in background
    const result = await addFavoriteStation(cleanedStation);
    
    if (result.success) {
      onFavoriteAdded?.(cleanedStation);
      // Refresh server data in background (won't block UI)
      router.refresh();
    } else {
      // Rollback optimistic update on error
      setOptimisticFavorites((prev) => prev.filter((id) => id !== extId));
    }
    
    setAddingFavoriteId(null);
  }, [onFavoriteAdded, router]);

  const isFavorite = useCallback((station: Station) => {
    const extId = station.extId || station.id;
    return favoriteExtIds.includes(extId) || optimisticFavorites.includes(extId);
  }, [favoriteExtIds, optimisticFavorites]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-station-search]")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full" data-station-search>
      {/* Search input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[16px] placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden max-h-[300px] overflow-y-auto">
          {results.map((station, index) => {
            const extId = station.extId || station.id;
            const isStationFavorite = isFavorite(station);
            const isAddingThis = addingFavoriteId === extId;

            return (
              <div
                key={`${station.id}-${index}`}
                className="flex items-stretch border-b border-gray-50 last:border-b-0"
              >
                <button
                  onClick={() => handleSelect(station)}
                  className="flex-1 flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left min-w-0"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-[#1734D8]" />
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="font-medium text-gray-900 text-[14px] leading-tight">
                      {cleanStationName(station.name)}
                    </p>
                    {station.municipality && (
                      <p className="text-[13px] text-gray-500 leading-tight mt-0.5">
                        {station.municipality}
                      </p>
                    )}
                  </div>
                </button>
                
                {/* Favorite button - fixed width, always visible */}
                <button
                  onClick={(e) => handleAddFavorite(e, station)}
                  disabled={isStationFavorite || isAddingThis}
                  className={`w-12 flex items-center justify-center flex-shrink-0 transition-all ${
                    isStationFavorite 
                      ? "text-yellow-500" 
                      : "text-gray-300 hover:text-yellow-500 hover:bg-yellow-50"
                  } ${isAddingThis ? "opacity-50" : ""}`}
                  title={isStationFavorite ? "Added to favorites" : "Add to favorites"}
                >
                  {isAddingThis ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Star 
                      size={18} 
                      fill={isStationFavorite ? "currentColor" : "none"}
                      strokeWidth={isStationFavorite ? 0 : 2}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Extract municipality from station name
 */
function extractMunicipality(name: string): string | undefined {
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    return parenMatch[1];
  }
  return undefined;
}

/**
 * Clean station name by removing municipality in parentheses
 */
function cleanStationName(name: string): string {
  return name.replace(/\s*\([^)]+\)\s*$/, "").trim();
}
