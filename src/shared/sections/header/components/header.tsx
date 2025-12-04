"use client";

import { LogoText } from "@/components/logo-text";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  showBack?: boolean;
  showBell?: boolean;
  onBack?: () => void;
}

export function Header({ showBack, showBell = true, onBack }: HeaderProps) {
  return (
    <header 
      className="bg-[#1734D8] px-3 pb-3 flex items-center"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
    >
      {/* Left side - fixed width for centering */}
      <div className="w-8 flex items-center justify-start">
        {showBack ? (
          <button onClick={onBack} className="text-white flex items-center justify-center -ml-1">
            <ChevronLeft size={26} strokeWidth={1.5} />
          </button>
        ) : (
          <button className="text-white flex items-center justify-center">
            {/* Hamburger menu icon */}
            <svg width="18" height="12" viewBox="0 0 22 16" fill="none">
              <path d="M1 1H21M1 8H21M1 15H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Center - logo */}
      <div className="flex-1 flex items-center justify-center">
        <LogoText width={120} height={22} />
      </div>

      {/* Right side - fixed width for centering */}
      <div className="w-10 flex items-center justify-end">
        {showBell ? (
          <button className="text-white flex items-center justify-center">
            {/* Bell icon */}
            <svg width="15" height="17" viewBox="0 0 51 58" fill="none">
              <path d="M5.42913 44.5255C0.0461357 23.8215 -1.66058 19.1775 9.09157 7.76447C9.539 4.26947 9.42832 4.22647 10.5077 1.55347C16.3243 -2.59553 14.8666 2.66248 19.0227 4.62148C32.1919 10.8285 33.631 8.78948 40.2963 34.9815C43.5667 36.7835 46.9017 39.1245 50.1444 41.2675C45.2596 43.4485 38.9264 44.7435 33.8847 46.0725L32.441 48.9335L32.4778 52.1135C28.6447 58.5795 24.5025 59.1165 20.2542 53.7455L19.4978 51.7415L15.0834 51.3365C11.2872 51.6655 4.21137 53.9465 0 54.8225C1.69746 51.3185 3.63941 47.8615 5.42913 44.5255Z" fill="white"/>
            </svg>
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>
    </header>
  );
}
