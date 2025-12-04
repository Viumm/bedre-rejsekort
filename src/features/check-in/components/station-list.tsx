"use client";

import type { Station } from "../types";
import { MapPin } from "lucide-react";

interface StationListProps {
  stations: Station[];
  onSelect: (station: Station) => void;
}

export function StationList({ stations, onSelect }: StationListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium text-gray-600">
        Hvad vil du tjekke ind fra?
      </h2>
      <div className="flex flex-col gap-3">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => onSelect(station)}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-left active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-[#1734D8]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-[17px]">{station.name}</p>
              <p className="text-sm text-gray-500">({station.municipality})</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
