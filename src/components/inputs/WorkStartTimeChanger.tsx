import React from "react";

interface WorkStartTimeChangerProps {
  startHour: number;
  setStartHour: (hour: number) => void;
}

const WorkStartTimeChanger = ({
  startHour,
  setStartHour,
}: WorkStartTimeChangerProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-gray-700">
        勤務開始時間
      </label>
      <select
        value={startHour}
        onChange={(e) => setStartHour(parseInt(e.target.value))}
        className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>
            {`${i}:00`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WorkStartTimeChanger;
