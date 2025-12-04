"use client";

import type { Passenger } from "../types";

interface PassengerListProps {
  passengers: Passenger[];
  onSelect: (passenger: Passenger) => void;
}

export function PassengerList({ passengers, onSelect }: PassengerListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-[22px] text-black mb-4">Hvem er du?</h2>
      {passengers.map((passenger) => (
        <button
          key={passenger.fullName}
          onClick={() => onSelect(passenger)}
          className="w-full p-4 bg-white rounded-xl border border-[#E5E5E5] flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          {/* Avatar circle */}
          <div className="w-12 h-12 rounded-full bg-[#E8F4FD] flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#1734D8" strokeWidth="2"/>
              <path d="M4 21V19C4 16.7909 6.23858 15 9 15H15C17.7614 15 20 16.7909 20 19V21" stroke="#1734D8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-black text-[17px]">{passenger.fullName}</p>
            <p className="text-[#666666] text-[14px]">
              {passenger.type} · {passenger.age} years
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

