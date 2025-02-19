import React from "react";

interface WorkHourSelectProps {
  unitNum: number;
  setUnitNum: (unitNum: number) => void;
}

const WorkHourSelect = ({ unitNum, setUnitNum }: WorkHourSelectProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-gray-700">
        勤務時間
      </label>
      <input
        type="number"
        min="1"
        max="24"
        value={unitNum}
        onChange={(e) => setUnitNum(Math.max(1, parseInt(e.target.value) || 1))}
        className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
};

export default WorkHourSelect;
