"use client";

import Image from "next/image";
import { type ActiveTicket, calculateAge } from "../types";

interface TicketDisplayProps {
  ticket: ActiveTicket;
  currentTime: string;
}

export function TicketDisplay({ ticket, currentTime }: TicketDisplayProps) {
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col bg-white w-full h-full">
      {/* QR Code Section - using pendlerkort image */}
      <div className="relative flex-shrink-0 flex-1 min-h-[380px] w-full">
        <Image
          src="/pendlerkort.png"
          alt="Ticket barcode"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Timer bar - horizontal gradient with animation */}
      <div 
        className="h-[62px] flex items-center justify-center flex-shrink-0 animate-gradient-shift"
        style={{
          backgroundImage: "linear-gradient(90deg, #fa6a52 0%, #d8446a 25%, #c82886 50%, #d8446a 75%, #fa6a52 100%)",
          backgroundSize: "150% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className="text-white text-[42px] font-bold tabular-nums" style={{ letterSpacing: '2px' }}>
          {currentTime}
        </span>
      </div>

      {/* Valid from - blue bar */}
      <div className="bg-[#1734D8] h-[62px] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[14px]">
          Valid from  <span className="font-bold">{formatDate(ticket.validFrom)}</span>
        </span>
      </div>

      {/* Station info */}
      <div className="px-4 py-3 flex-shrink-0 bg-white">
        <div className="flex justify-between">
          <div className="flex-1 min-w-0 pr-3 overflow-hidden">
            <p className="text-[11px] text-black mb-0.5">From</p>
            <p className="font-semibold text-black text-[16px] leading-snug" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
              {ticket.station.municipality && !ticket.station.name.includes(ticket.station.municipality)
                ? `${ticket.station.name} (${ticket.station.municipality})`
                : ticket.station.name}
            </p>
          </div>
          <span className="flex-shrink-0 self-center px-1.5 py-0.5 bg-[#dce1ec] rounded text-[13px] text-[#333333] font-semibold border border-[#E0E0E0]">
            {ticket.passenger.travelClass}
          </span>
        </div>
      </div>

      {/* Divider with margins */}
      <div className="mx-4 border-b border-[#F0F0F0]" />

      {/* Passenger info */}
      <div className="px-4 py-3 border-b border-[#F0F0F0] flex-shrink-0 bg-white">
        <div className="flex justify-between">
          <div>
            <p className="text-[11px] text-black mb-0.5">Passenger</p>
            <p className="font-semibold text-black text-[16px]">{ticket.passenger.fullName}</p>
            <p className="text-black text-[16px]">
              {ticket.passenger.birthDate} · {calculateAge(ticket.passenger.birthDate)} years
            </p>
          </div>
          <span className="flex-shrink-0 self-end px-1.5 py-0.5 bg-[#dce1ec] rounded text-[13px] text-[#333333] font-semibold border border-[#E0E0E0]">
            {ticket.passenger.type}
          </span>
        </div>
      </div>

      {/* Ticket ID */}
      <div className="pt-2 pb-12 text-center flex-1 bg-white">
        <p className="text-[11px] text-black">
          Ticket-ID: {ticket.ticketId}
        </p>
      </div>
    </div>
  );
}
