"use client";

import { useState, useCallback } from "react";
import { Header } from "@/shared/sections/header/components/header";
import {
  StationList,
  PassengerList,
  CheckInSlider,
  TicketDisplay,
  UserInfo,
  StationInfo,
  CheckInIllustration,
  NoVibrationIcon,
  CheckedInIcon,
} from "@/features/check-in/components";
import { useTimer } from "@/features/check-in/hooks/use-timer";
import type { Station, Passenger, ActiveTicket } from "@/features/check-in/types";

type AppState = "select-station" | "select-passenger" | "check-in" | "ticket";

function generateTicketId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    if (i === 8) result += "/";
    else result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface HomeClientProps {
  initialPassengers: Passenger[];
  initialStations: Station[];
}

export function HomeClient({ initialPassengers, initialStations }: HomeClientProps) {
  const [appState, setAppState] = useState<AppState>("select-station");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const { elapsed, currentTime } = useTimer(checkInTime);

  const handleSelectStation = useCallback((station: Station) => {
    setSelectedStation(station);
    // If passenger is already selected, go directly to check-in
    if (selectedPassenger) {
      setAppState("check-in");
    } else {
      setAppState("select-passenger");
    }
  }, [selectedPassenger]);

  const handleSelectPassenger = useCallback((passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setAppState("check-in");
  }, []);

  const handleCheckIn = useCallback(() => {
    if (!selectedStation || !selectedPassenger) return;

    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    setActiveTicket({
      ticketId: generateTicketId(),
      station: selectedStation,
      passenger: selectedPassenger,
      validFrom: now,
    });
  }, [selectedStation, selectedPassenger]);

  const handleCheckOut = useCallback(() => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setActiveTicket(null);
  }, []);

  const handleShowTicket = useCallback(() => {
    if (activeTicket) {
      setAppState("ticket");
    }
  }, [activeTicket]);

  const handleBack = useCallback(() => {
    if (appState === "ticket") {
      setAppState("check-in");
    } else if (appState === "check-in") {
      setSelectedPassenger(null);
      setIsCheckedIn(false);
      setCheckInTime(null);
      setActiveTicket(null);
      setAppState("select-passenger");
    } else if (appState === "select-passenger") {
      setSelectedStation(null);
      setAppState("select-station");
    }
  }, [appState]);

  const handleChangeStation = useCallback(() => {
    setSelectedStation(null);
    setActiveTicket(null);
    setCheckInTime(null);
    setIsCheckedIn(false);
    setAppState("select-station");
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        showBack={appState !== "select-station"}
        showBell={appState !== "ticket"}
        onBack={handleBack}
      />

      {/* User info bar - only show when passenger is selected and not on ticket page */}
      {selectedPassenger && appState !== "ticket" && <UserInfo passenger={selectedPassenger} />}

      <div className="flex-1 flex flex-col">
        {appState === "select-station" && (
          <div className="flex-1 p-4 bg-white">
            <StationList stations={initialStations} onSelect={handleSelectStation} />
          </div>
        )}

        {appState === "select-passenger" && (
          <div className="flex-1 p-4 bg-white">
            <PassengerList passengers={initialPassengers} onSelect={handleSelectPassenger} />
          </div>
        )}

        {appState === "check-in" && selectedStation && (
          <div className="flex-1 flex flex-col bg-white relative">
            {/* Illustration area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {isCheckedIn ? (
                <>
                  <CheckedInIcon size={70} />
                  <button 
                    onClick={handleShowTicket}
                    className="mt-6 px-6 py-2.5 bg-[#3D3D3D] text-white rounded-full font-medium text-[14px] shadow-md"
                  >
                    Show ticket
                  </button>
                </>
              ) : (
                <div className="w-full max-w-[200px]">
                  <CheckInIllustration />
                </div>
              )}
            </div>

            {/* FAB Button for adding passengers - higher up */}
            <div className="absolute right-4 bottom-[240px]">
              <button className="w-[52px] h-[52px] bg-[#1734D8] rounded-full flex items-center justify-center shadow-lg">
                {/* People icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="3" stroke="white" strokeWidth="2"/>
                  <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="17" cy="10" r="2.5" stroke="white" strokeWidth="2"/>
                  <path d="M17 15C19.2091 15 21 16.7909 21 19V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Bottom section */}
            <div className="bg-white pb-6">
              <StationInfo
                station={selectedStation}
                onChangeStation={handleChangeStation}
              />
              
              {/* Icon above slider, aligned right */}
              <div className="px-4 flex justify-end">
                <button className="p-0.5">
                  <NoVibrationIcon size={20} />
                </button>
              </div>
              
              {/* Slider - full width */}
              <div className="px-4 -mt-2">
                <CheckInSlider
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  isCheckedIn={isCheckedIn}
                  elapsedTime={elapsed}
                />
              </div>
            </div>
          </div>
        )}

        {appState === "ticket" && activeTicket && (
          <div className="flex-1 flex flex-col">
            <TicketDisplay ticket={activeTicket} currentTime={currentTime} />
          </div>
        )}
      </div>
    </div>
  );
}

