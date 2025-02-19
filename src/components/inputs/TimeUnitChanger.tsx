import React from "react";

interface TimeUnitChangerProps {
  minuteGranularity: number;
  setMinuteGranularity: (granularity: number) => void;
}
const granularityOptions = [5, 10, 15, 30, 60];
const TimeUnitChanger = ({
  minuteGranularity,
  setMinuteGranularity,
}: TimeUnitChangerProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-gray-700">
        時間単位
      </label>
      <select
        value={minuteGranularity}
        onChange={(e) => setMinuteGranularity(parseInt(e.target.value))}
        className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {granularityOptions.map((option) => (
          <option key={option} value={option}>
            {option}分
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeUnitChanger;
