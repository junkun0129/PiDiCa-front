import React from "react";
import { describeArc } from "../../helpers/math";
import { REPORT_REGISTER_COLORS } from "../../const";
type SectorProps = {
  startAngle: number;
  endAngle: number;
  color: string;
  x: number;
  y: number;
  radius: number;
  isSectorDragging: boolean;
  isSectorSelected: boolean;
  onSectorClick: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onSectorMouseDown: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onHandleMouseDown: (
    e: React.MouseEvent<SVGCircleElement, MouseEvent>,
    type: "start" | "end"
  ) => void;
};
const Sector = ({
  startAngle,
  endAngle,
  color,
  x,
  y,
  radius,
  isSectorDragging,
  onSectorClick,
  onSectorMouseDown,
  onHandleMouseDown,
  isSectorSelected,
}: SectorProps) => {
  return (
    <g>
      <path
        d={describeArc(x, y, radius, startAngle, endAngle)}
        fill={color}
        className="cursor-move"
        opacity={isSectorDragging ? 0.7 : 0.9}
        onClick={(e) => onSectorClick(e)}
        onMouseDown={(e) => onSectorMouseDown(e)}
      />
      {isSectorSelected && (
        <>
          {/* ハンドル */}
          {["start", "end"].map((type) => {
            const angle = type === "start" ? startAngle : endAngle;
            return (
              <g key={type} style={{ pointerEvents: "all" }}>
                <circle
                  cx={125 + 90 * Math.cos(angle)}
                  cy={125 + 90 * Math.sin(angle)}
                  r="12"
                  className="handle-hitbox"
                  onMouseDown={(e) =>
                    onHandleMouseDown(e, type as "start" | "end")
                  }
                />
                <circle
                  cx={125 + 90 * Math.cos(angle)}
                  cy={125 + 90 * Math.sin(angle)}
                  r="6"
                  fill={REPORT_REGISTER_COLORS.handles.fill}
                  stroke={REPORT_REGISTER_COLORS.handles.stroke}
                  strokeWidth="2"
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </>
      )}
    </g>
  );
};

export default Sector;
