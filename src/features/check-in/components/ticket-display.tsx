"use client";

import Image from "next/image";
import type { ActiveTicket } from "../types";

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

      {/* Timer bar - horizontal gradient coral to pink */}
      <div 
        className="h-[60px] flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(90deg, #fa6a52 0%, #d8446a 25%, #c82886 50%, #d8446a 75%, #fa6a52 100%)",
        }}
      >
        <span className="text-white text-[42px] font-bold tabular-nums" style={{ letterSpacing: '2px' }}>
          {currentTime}
        </span>
      </div>

      {/* Valid from - blue bar */}
      <div className="bg-[#1734D8] h-[60px] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[14px]">
          Valid from  <span className="font-bold">{formatDate(ticket.validFrom)}</span>
        </span>
      </div>

      {/* Station info */}
      <div className="px-4 py-4 border-b border-[#E8E8E8] flex-shrink-0 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-[14px] text-black mb-0.5">From</p>
            <p className="font-semibold text-black text-[20px] leading-tight">{ticket.station.name}</p>
            <p className="font-semibold text-black text-[20px]">({ticket.station.municipality})</p>
          </div>
          <span className="flex-shrink-0 px-4 py-2 bg-[#EFEFEF] rounded text-[15px] text-black border border-[#D5D5D5]">
            {ticket.passenger.travelClass}
          </span>
        </div>
      </div>

      {/* Passenger info */}
      <div className="px-4 py-4 border-b border-[#E8E8E8] flex-shrink-0 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[14px] text-black mb-0.5">Passenger</p>
            <p className="font-semibold text-black text-[20px]">{ticket.passenger.fullName}</p>
            <p className="text-black text-[15px]">
              {ticket.passenger.birthDate} · {ticket.passenger.age} years
            </p>
          </div>
          <span className="flex-shrink-0 px-4 py-2 bg-[#EFEFEF] rounded text-[15px] text-black border border-[#D5D5D5]">
            {ticket.passenger.type}
          </span>
        </div>
      </div>

      {/* Ticket ID */}
      <div className="py-5 text-center flex-1 bg-white">
        <p className="text-[13px] text-[#888888]">
          Ticket-ID: {ticket.ticketId}
        </p>
      </div>
    </div>
  );
}
