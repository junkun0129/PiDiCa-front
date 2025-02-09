import React, { useEffect, useRef, useState } from "react";
import { describeArc, getPointOnCircle } from "../helpers/math";

interface Task {
  id: string;
  title: string;
  color: string;
}

interface Sector {
  id: string;
  startAngle: number;
  endAngle: number;
  color: string;
}

const MAX_ANGLE = 2 * Math.PI; // 360°

const COLORS = {
  tasks: [
    "#06B6D4", // Cyan-500
    "#8B5CF6", // Violet-500
    "#EC4899", // Pink-500
    "#10B981", // Emerald-500
    "#F59E0B", // Amber-500
    "#6366F1", // Indigo-500
  ],
  handles: {
    fill: "#ffffff",
    stroke: "#6366F1",
    hover: "#8B5CF6",
  },
};

const normalizeAngle = (angle: number): number => {
  while (angle < 0) angle += 2 * Math.PI;
  while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
  return angle;
};

const checkSectorCollision = (sector1: Sector, sector2: Sector): boolean => {
  const s1Start = normalizeAngle(sector1.startAngle);
  const s1End = normalizeAngle(sector1.endAngle);
  const s2Start = normalizeAngle(sector2.startAngle);
  const s2End = normalizeAngle(sector2.endAngle);
  return !(s1End <= s2Start || s1Start >= s2End);
};

const ReportRegisterPage = () => {
  const [tasks] = useState<Task[]>([
    { id: "1", title: "Task 1", color: "#ff0000" },
    { id: "2", title: "Task 2", color: "#00ff00" },
    { id: "3", title: "Task 3", color: "#0000ff" },
  ]);

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [unitNum] = useState(12);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<
    "start" | "end" | "move" | null
  >(null);
  const [dragPreview, setDragPreview] = useState<{
    sector: Sector;
    valid: boolean;
  } | null>(null);
  const [dragPreviewAngle, setDragPreviewAngle] = useState<number | null>(null);
  const [isDraggingSector, setIsDraggingSector] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function findNearestPoint(xp: number, yp: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const svgX = ((xp - rect.left) / rect.width) * 200;
    const svgY = ((yp - rect.top) / rect.height) * 200;

    let nearestPoint = { x: 0, y: 0 };
    let minDistance = Infinity;

    for (let i = 0; i < unitNum; i++) {
      const point = getPointOnCircle(100, 100, 90, unitNum, i);
      const distance = Math.sqrt((point.x - svgX) ** 2 + (point.y - svgY) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    }
    return nearestPoint;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedSector) return;

    const point = findNearestPoint(e.clientX, e.clientY);
    const angle = Math.atan2(point.y - 100, point.x - 100);

    if (isDraggingSector) {
      const currentSector = sectors.find((s) => s.id === selectedSector);
      if (!currentSector) return;

      const width = currentSector.endAngle - currentSector.startAngle;
      const previewSector = {
        ...currentSector,
        startAngle: angle,
        endAngle: angle + width,
      };

      const isValid = sectors.every(
        (sector) =>
          sector.id === selectedSector ||
          !checkSectorCollision(previewSector, sector)
      );

      setDragPreview({ sector: previewSector, valid: isValid });
    } else if (draggingHandle) {
      const currentSector = sectors.find((s) => s.id === selectedSector);
      if (!currentSector) return;

      let updatedSector = { ...currentSector };
      const currentWidth = currentSector.endAngle - currentSector.startAngle;

      if (draggingHandle === "start") {
        if (angle >= currentSector.endAngle) return;
        const newWidth = currentSector.endAngle - angle;
        if (newWidth > MAX_ANGLE) return;
        updatedSector.startAngle = angle;
      } else {
        if (angle <= currentSector.startAngle) return;
        const newWidth = angle - currentSector.startAngle;
        if (newWidth > MAX_ANGLE) return;
        updatedSector.endAngle = angle;
      }

      const isValid = sectors.every(
        (sector) =>
          sector.id === selectedSector ||
          !checkSectorCollision(updatedSector, sector)
      );

      if (isValid) {
        setSectors(
          sectors.map((sector) =>
            sector.id === selectedSector ? updatedSector : sector
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (isDraggingSector && dragPreview?.valid) {
      setSectors(
        sectors.map((sector) =>
          sector.id === selectedSector ? dragPreview.sector : sector
        )
      );
    }
    setIsDraggingSector(false);
    setDragPreview(null);
    setDraggingHandle(null);
  };

  const handleTaskDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleSectorMouseDown = (e: React.MouseEvent, sector: Sector) => {
    e.stopPropagation();
    setSelectedSector(sector.id);
    setIsDraggingSector(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTask) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const point = findNearestPoint(e.clientX, e.clientY);
    const angle = Math.atan2(point.y - 100, point.x - 100);
    setDragPreviewAngle(angle);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTask) return;

    const point = findNearestPoint(e.clientX, e.clientY);
    const angle = Math.atan2(point.y - 100, point.x - 100);

    const newSector: Sector = {
      id: crypto.randomUUID(),
      startAngle: angle,
      endAngle: angle + (Math.PI * 2) / unitNum,
      color: draggedTask.color,
    };

    const isValid = sectors.every(
      (sector) => !checkSectorCollision(newSector, sector)
    );

    if (isValid) {
      setSectors([...sectors, newSector]);
    }

    setDraggedTask(null);
    setDragPreviewAngle(null);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedSector(null);
    }
  };

  const handleSectorClick = (e: React.MouseEvent, sector: Sector) => {
    e.stopPropagation();
    setSelectedSector(sector.id);
  };

  const handleHandleMouseDown = (
    e: React.MouseEvent,
    sectorId: string,
    handleType: "start" | "end"
  ) => {
    e.stopPropagation();
    setSelectedSector(sectorId);
    setDraggingHandle(handleType);
  };

  return (
    <div className="flex gap-4 p-8">
      <div
        ref={containerRef}
        className="relative w-[400px] aspect-square border border-gray-200 rounded-lg"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleBackgroundClick}
      >
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={"gray"}
            strokeWidth="2"
            fill={"black"}
          />

          {sectors.map((sector) => (
            <g key={sector.id}>
              <path
                d={describeArc(
                  100,
                  100,
                  90,
                  sector.startAngle,
                  sector.endAngle
                )}
                fill={sector.color}
                className="cursor-move"
                opacity={
                  isDraggingSector && selectedSector === sector.id ? 0.5 : 1
                }
                onClick={(e) => handleSectorClick(e, sector)}
                onMouseDown={(e) => handleSectorMouseDown(e, sector)}
              />
              {selectedSector === sector.id && (
                <>
                  <g style={{ pointerEvents: "all" }}>
                    <circle
                      cx={100 + 90 * Math.cos(sector.startAngle)}
                      cy={100 + 90 * Math.sin(sector.startAngle)}
                      r="6"
                      fill={COLORS.handles.fill}
                      stroke={COLORS.handles.stroke}
                      strokeWidth="2"
                      className="cursor-pointer"
                      style={{ pointerEvents: "all" }}
                      onMouseDown={(e) =>
                        handleHandleMouseDown(e, sector.id, "start")
                      }
                    />
                    <circle
                      cx={100 + 90 * Math.cos(sector.endAngle)}
                      cy={100 + 90 * Math.sin(sector.endAngle)}
                      r="6"
                      fill={COLORS.handles.fill}
                      stroke={COLORS.handles.stroke}
                      strokeWidth="2"
                      className="cursor-pointer"
                      style={{ pointerEvents: "all" }}
                      onMouseDown={(e) =>
                        handleHandleMouseDown(e, sector.id, "end")
                      }
                    />
                  </g>
                </>
              )}
            </g>
          ))}

          {dragPreview && (
            <path
              d={describeArc(
                100,
                100,
                90,
                dragPreview.sector.startAngle,
                dragPreview.sector.endAngle
              )}
              fill={dragPreview.valid ? "gray" : "rgba(239, 68, 68, 0.2)"}
              className="pointer-events-none"
            />
          )}

          {dragPreviewAngle !== null && draggedTask && (
            <path
              d={describeArc(
                100,
                100,
                90,
                dragPreviewAngle,
                dragPreviewAngle + (Math.PI * 2) / unitNum
              )}
              fill={draggedTask.color}
              opacity={0.5}
              className="pointer-events-none"
            />
          )}
        </svg>
      </div>

      <div className="w-64 p-4 bg-white rounded-lg shadow-lg">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => handleTaskDragStart(task)}
            className="p-3 mb-3 rounded-md cursor-move transition-transform hover:scale-105"
            style={{
              backgroundColor: COLORS.tasks[index % COLORS.tasks.length],
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportRegisterPage;
