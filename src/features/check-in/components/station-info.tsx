import type { Station } from "../types";

interface StationInfoProps {
  station: Station;
  onChangeStation?: () => void;
}

export function StationInfo({ station, onChangeStation }: StationInfoProps) {
  return (
    <div className="px-4 pb-1">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-[19px] font-normal text-gray-900 leading-snug">
            {station.name} ({station.municipality})
          </h2>
          <p className="text-[#6B7280] text-[14px] font-normal mt-0.5">Check in before you board</p>
        </div>
        {onChangeStation && (
          <button
            onClick={onChangeStation}
            className="flex-shrink-0 px-3.5 py-1 text-[13px] font-medium text-[#374151] bg-[#E5E7EB] rounded-full hover:bg-gray-300 transition-colors"
          >
            Change
          </button>
        )}
      </div>
    </div>
  );
}
