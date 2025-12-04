import type { Passenger } from "../types";

interface UserInfoProps {
  passenger: Passenger;
}

export function UserInfo({ passenger }: UserInfoProps) {
  return (
    <div className="px-4 py-2.5 bg-white">
      <h1 className="text-[17px] font-bold text-gray-900 leading-tight">{passenger.name}</h1>
      <p className="text-[#6B7280] text-[17px] font-normal">
        {passenger.travelClass} · {passenger.type}
      </p>
    </div>
  );
}
