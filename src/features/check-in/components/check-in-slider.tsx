"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CheckInSliderProps {
  onCheckIn: () => void;
  onCheckOut?: () => void;
  isCheckedIn: boolean;
  elapsedTime: string;
}

export function CheckInSlider({ 
  onCheckIn, 
  onCheckOut, 
  isCheckedIn, 
  elapsedTime 
}: CheckInSliderProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const BUTTON_SIZE = 80;
  const PADDING = 4;

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

  const maxDrag = sliderWidth - BUTTON_SIZE - PADDING * 2;

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX - dragX;
  }, [dragX]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    
    if (isCheckedIn) {
      const newX = Math.max(0, Math.min(clientX - startXRef.current, maxDrag));
      setDragX(newX);
    } else {
      const newX = Math.max(0, Math.min(clientX - startXRef.current, maxDrag));
      setDragX(newX);
    }
  }, [isDragging, isCheckedIn, maxDrag]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (isCheckedIn) {
      if (dragX <= maxDrag * 0.2) {
        setDragX(0);
        onCheckOut?.();
      } else {
        setDragX(maxDrag);
      }
    } else {
      if (dragX >= maxDrag * 0.8) {
        setDragX(maxDrag);
        onCheckIn();
      } else {
        setDragX(0);
      }
    }
  }, [isDragging, dragX, maxDrag, onCheckIn, onCheckOut, isCheckedIn]);

  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);

  // Sync dragX when isCheckedIn changes from parent
  // This is necessary to sync slider position with external state
  useLayoutEffect(() => {
    if (isCheckedIn && maxDrag > 0) {
      setDragX(maxDrag); // eslint-disable-line react-hooks/set-state-in-effect
    } else if (!isCheckedIn) {
      setDragX(0);
    }
  }, [isCheckedIn, maxDrag]);

  if (isCheckedIn) {
    return (
      <div
        ref={sliderRef}
        className="relative w-full h-[88px] rounded-full select-none"
        style={{ 
          background: "linear-gradient(90deg, #13886A 0%, #19AB86 100%)",
          border: "7px solid #1aac87",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* Elapsed time on the left */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2">
          <span className="text-white font-semibold text-[24px] tabular-nums">
            {elapsedTime}
          </span>
        </div>

        {/* Red check-out button on the right */}
        <div
          className="absolute w-[72px] h-[72px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            top: "1px",
            right: "1px",
            transform: `translateX(${-(maxDrag - dragX)}px)`,
            backgroundColor: "#E63946",
            border: "7px solid white",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        >
          <ChevronLeft className="text-white" size={32} strokeWidth={2.5} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-[88px] rounded-full select-none"
      style={{ 
        background: "linear-gradient(90deg, #E8EAED 0%, #DEE0E3 50%, #D5D7DA 100%)",
        border: "7px solid #F0F0F0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* "Check in" text on the right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <span className="text-black font-semibold text-[15px]">Check in</span>
      </div>

      {/* Green check-in button on the left with white border */}
      <div
        className="absolute w-[72px] h-[72px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          top: "1px",
          left: "1px",
          transform: `translateX(${dragX}px)`,
          backgroundColor: "#22A67D",
          border: "7px solid white",
          boxShadow: "0 2px 8px rgba(34, 166, 125, 0.4)",
          transition: isDragging ? "none" : "transform 0.2s ease-out",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        <ChevronRight className="text-white" size={32} strokeWidth={2.5} />
      </div>
    </div>
  );
}
