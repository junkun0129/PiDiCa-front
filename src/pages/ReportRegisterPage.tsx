import React, { useEffect, useRef, useState } from "react";
import { describeArc, getPointOnCircle } from "../helpers/math";
import { Modal, Input, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface Task {
  id: string;
  name: string;
  color: string;
  isFixed?: boolean;
  task_cd?: string;
}

interface Sector {
  id: string;
  startAngle: number;
  endAngle: number;
  color: string;
}

interface SectorDetail {
  check: string;
  do: string;
  plan: string;
  action: string;
}

interface DragPreview {
  sector: Sector;
  valid: boolean;
}

const MAX_ANGLE = 2 * Math.PI; // 360°

const COLORS = {
  background: "#1A1A1A", // よりダークな背景
  circle: {
    fill: "#242424", // 深みのあるグレー
    stroke: "#404040", // ボーダー用のミディアムグレー
  },
  time: {
    text: "#9CA3AF", // 柔らかいグレー
    startTime: "#D1D5DB", // 勤務開始時間用の明るめのグレー
  },
  ticks: {
    main: "#4B5563", // メインの目盛り
    sub: "#374151", // サブの目盛り
  },
  handles: {
    fill: "#E5E7EB", // ハンドルの塗り
    stroke: "#6B7280", // ハンドルの縁取り
  },
  preview: {
    valid: "rgba(209, 213, 219, 0.5)", // 有効なプレビュー
    invalid: "rgba(239, 68, 68, 0.3)", // 無効なプレビュー
  },
  sectors: [
    "#3B82F6", // ブルー
    "#10B981", // グリーン
    "#8B5CF6", // パープル
    "#F59E0B", // オレンジ
    "#EC4899", // ピンク
    "#6366F1", // インディゴ
  ],
};

const normalizeAngle = (angle: number): number => {
  let normalized = angle % (Math.PI * 2);
  return normalized < -Math.PI ? normalized + Math.PI * 2 : normalized;
};

const checkSectorCollision = (sector1: Sector, sector2: Sector): boolean => {
  const normalizeToPositive = (angle: number): number => {
    let normalized = angle % (Math.PI * 2);
    return normalized < 0 ? normalized + Math.PI * 2 : normalized;
  };

  const s1Start = normalizeToPositive(sector1.startAngle);
  const s1End = normalizeToPositive(sector1.endAngle);
  const s2Start = normalizeToPositive(sector2.startAngle);
  const s2End = normalizeToPositive(sector2.endAngle);

  // セクターの実際の範囲を計算
  const getRange = (start: number, end: number): number => {
    if (end < start) return end + Math.PI * 2 - start;
    return end - start;
  };

  const s1Range = getRange(s1Start, s1End);
  const s2Range = getRange(s2Start, s2End);

  // 一周以上のセクターは許可しない
  if (s1Range >= Math.PI * 2 || s2Range >= Math.PI * 2) return true;

  // 境界が一致する場合は衝突とみなす
  if (Math.abs(s1Start - s2Start) < 0.01 || Math.abs(s1End - s2End) < 0.01)
    return true;

  // セクターが12時をまたぐ場合の処理
  if (s1End < s1Start) {
    return !(s2End <= s1Start && s2Start >= s1End);
  }
  if (s2End < s2Start) {
    return !(s1End <= s2Start && s1Start >= s2End);
  }

  // 通常の重なりチェック
  return !(s1End <= s2Start || s1Start >= s2End);
};

const ReportRegisterPage = () => {
  // 固定タスクの定義
  const FIXED_TASKS: Task[] = [
    {
      id: "break",
      name: "休憩",
      color: "#9CA3AF", // グレー
      isFixed: true,
      task_cd: "BREAK_001", // 固定のtask_cd
    },
    {
      id: "meeting",
      name: "打合せ",
      color: "#6366F1", // インディゴ
      isFixed: true,
      task_cd: "MEET_001",
    },
    {
      id: "desk-work",
      name: "事務作業",
      color: "#10B981", // グリーン
      isFixed: true,
      task_cd: "DESK_001",
    },
    {
      id: "training",
      name: "研修",
      color: "#F59E0B", // オレンジ
      isFixed: true,
      task_cd: "TRAIN_001",
    },
    {
      id: "commute",
      name: "移動",
      color: "#8B5CF6", // パープル
      isFixed: true,
      task_cd: "MOVE_001",
    },
  ];

  // 状態の型を明示的に指定
  const [tasks, setTasks] = useState<Task[]>(FIXED_TASKS);

  // APIからタスクを取得する処理
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // const apiTasks = await fetchTasksFromAPI();
        // setTasks([...FIXED_TASKS, ...apiTasks]);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    // fetchTasks();
  }, []);

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [unitNum, setUnitNum] = useState(8);
  const [minuteGranularity, setMinuteGranularity] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<
    "start" | "end" | "move" | null
  >(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [dragPreviewAngle, setDragPreviewAngle] = useState<number | null>(null);
  const [isDraggingSector, setIsDraggingSector] = useState(false);

  const granularityOptions = [5, 10, 15, 30, 60];

  const [startHour, setStartHour] = useState(9);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSectorDetails, setSelectedSectorDetails] =
    useState<SectorDetail>({
      check: "",
      do: "",
      plan: "",
      action: "",
    });
  const [sectorDetails, setSectorDetails] = useState<
    Record<string, SectorDetail>
  >({});
  const [editingSectorId, setEditingSectorId] = useState<string | null>(null);

  const getAngleStep = () => (Math.PI * 2) / unitNum;
  const getSubdivisions = () => 60 / minuteGranularity;

  const snapToValidAngle = (angle: number) => {
    const step = getAngleStep() / getSubdivisions();
    return Math.round(angle / step) * step;
  };

  const formatTime = (angle: number): string => {
    // 角度を時計回りに変換（-π/2 が開始時刻）
    const normalizedAngle = -angle + Math.PI / 2;

    // インデックスを計算（どの区画にいるか）
    let index = Math.round((normalizedAngle / (Math.PI * 2)) * unitNum);
    if (index < 0) index += unitNum;
    if (index >= unitNum) index = 0;

    // インデックスから実際の時刻を計算
    const hour = (startHour + index) % 24;

    return `${hour.toString().padStart(2, "0")}-00`;
  };

  const getTimeLabel = (index: number): string => {
    const hour = (startHour + index) % 24;
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const findNearestPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0, angle: 0 };

    const svgX = ((clientX - rect.left) / rect.width) * 250;
    const svgY = ((clientY - rect.top) / rect.height) * 250;

    const dx = svgX - 125;
    const dy = svgY - 125;

    let angle = Math.atan2(dy, dx);

    const step = (Math.PI * 2) / (unitNum * getSubdivisions());
    angle = Math.round(angle / step) * step;

    return {
      x: 125 + 90 * Math.cos(angle),
      y: 125 + 90 * Math.sin(angle),
      angle: angle,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedSector) return;

    const point = findNearestPoint(e.clientX, e.clientY);
    const angle = point.angle;

    // 勤務開始時間（12時）以前への移動のみを制限
    if (angle < -Math.PI / 2 && angle > -Math.PI) return;

    if (isDraggingSector) {
      const currentSector = sectors.find((s) => s.id === selectedSector);
      if (!currentSector) return;

      // セクターの幅を維持
      let width = currentSector.endAngle - currentSector.startAngle;
      if (width < 0) width += Math.PI * 2;

      let previewSector = {
        ...currentSector,
        startAngle: angle,
        endAngle: angle + width,
      };

      const isValid = sectors.every((sector) => {
        if (sector.id === selectedSector) return true;
        return !checkSectorCollision(previewSector, sector);
      });

      setDragPreview({ sector: previewSector, valid: isValid });
    } else if (draggingHandle) {
      const currentSector = sectors.find((s) => s.id === selectedSector);
      if (!currentSector) return;

      let updatedSector = { ...currentSector };

      if (draggingHandle === "start") {
        // 開始ハンドルの移動
        const endAngle = currentSector.endAngle;
        const angleDiff = normalizeAngle(endAngle - angle);

        if (angleDiff > 0.01) {
          updatedSector.startAngle = angle;
        } else {
          return;
        }
      } else {
        // 終了ハンドルの移動
        const startAngle = currentSector.startAngle;
        const angleDiff = normalizeAngle(angle - startAngle);

        if (angleDiff > 0.01) {
          updatedSector.endAngle = angle;
        } else {
          return;
        }
      }

      // 他のセクターとの衝突をチェック
      const isValid = sectors.every((sector) => {
        if (sector.id === selectedSector) return true;
        return !checkSectorCollision(updatedSector, sector);
      });

      // プレビューを更新し、有効な場合は即座にセクターを更新
      setDragPreview({ sector: updatedSector, valid: isValid });
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
    setDraggingHandle(null);
    setDragPreview(null);
  };

  const handleTaskDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleSectorMouseDown = (e: React.MouseEvent, sector: Sector) => {
    e.stopPropagation();
    if (e.button !== 0) return; // 左クリックのみ

    setSelectedSector(sector.id);
    setIsDraggingSector(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTask) return;

    const point = findNearestPoint(e.clientX, e.clientY);
    setDragPreviewAngle(point.angle);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTask) return;

    const point = findNearestPoint(e.clientX, e.clientY);
    const angle = point.angle;

    // 勤務開始時間以前への配置のみを制限
    const normalizedStartAngle = normalizeAngle(angle);
    if (normalizedStartAngle < -Math.PI / 2 && normalizedStartAngle > -Math.PI)
      return;

    // セクターの幅を計算（unitNumに基づく）
    const sectorWidth = (Math.PI * 2) / unitNum;

    const newSector: Sector = {
      id: crypto.randomUUID(),
      startAngle: angle,
      endAngle: normalizeAngle(angle + sectorWidth),
      color: draggedTask.color,
    };

    const isValid = sectors.every(
      (sector) => !checkSectorCollision(newSector, sector)
    );

    if (isValid) {
      setSectors((prevSectors) => [...prevSectors, newSector]);
    }

    setDraggedTask(null);
    setDragPreviewAngle(null);
  };

  const handleBackgroundClick = () => {
    setSelectedSector(null);
    setDragPreview(null);
    setIsDraggingSector(false);
    setDraggingHandle(null);
  };

  const handleSectorClick = (e: React.MouseEvent, sector: Sector) => {
    e.stopPropagation();
    setSelectedSector(sector.id);
    setEditingSectorId(sector.id);
    setSelectedSectorDetails(
      sectorDetails[sector.id] || {
        check: "",
        do: "",
        plan: "",
        action: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleHandleMouseDown = (
    e: React.MouseEvent,
    sectorId: string,
    handle: "start" | "end"
  ) => {
    e.stopPropagation();
    if (e.button !== 0) return; // 左クリックのみ

    setSelectedSector(sectorId);
    setDraggingHandle(handle);
  };

  // モーダルの確定ボタン処理
  const handleModalOk = () => {
    if (editingSectorId) {
      setSectorDetails({
        ...sectorDetails,
        [editingSectorId]: selectedSectorDetails,
      });
    }
    setIsModalVisible(false);
  };

  // 確定ボタンの処理
  const handleSubmit = () => {
    const reportItems = sectors.map((sector) => {
      const task = tasks.find((t) => t.color === sector.color);
      const details = sectorDetails[sector.id] || {
        check: "",
        do: "",
        plan: "",
        action: "",
      };

      return {
        task_cd: task?.task_cd || "",
        starttime: formatTime(sector.startAngle),
        endtime: formatTime(sector.endAngle),
        ...details,
      };
    });

    const reportData = {
      report_workhour: `${24 / unitNum}`,
      report_items: reportItems,
    };

    console.log("Report Data:", reportData);
  };

  // セクターの角度変更時のハンドラーを修正
  const handleSectorChange = (newStartAngle: number, newEndAngle: number) => {
    setSectors(
      sectors.map((sector) =>
        sector.id === selectedSector
          ? { ...sector, startAngle: newStartAngle, endAngle: newEndAngle }
          : sector
      )
    );

    // 開始時刻と終了時刻を更新（フォーマットは "HH:00"）
    const startTime = formatTime(newStartAngle);
    const endTime = formatTime(newEndAngle);

    setSelectedSectorDetails((prev) => ({
      ...prev,
      startTime: startTime,
      endTime: endTime,
    }));
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                分割数
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={unitNum}
                onChange={(e) =>
                  setUnitNum(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                時間の粒度
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
            <div>
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
          </div>

          <div
            ref={containerRef}
            className="relative w-[500px] aspect-square border border-gray-700 rounded-lg bg-[#1A1A1A] select-none"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleBackgroundClick}
          >
            <svg width="100%" height="100%" viewBox="0 0 250 250">
              {/* 基本の円 */}
              <circle
                cx="125"
                cy="125"
                r="90"
                stroke={COLORS.circle.stroke}
                strokeWidth="2"
                fill={COLORS.circle.fill}
              />

              {/* 時刻表示 */}
              {Array.from({ length: unitNum }).map((_, i) => {
                const angle = (i * Math.PI * 2) / unitNum - Math.PI / 2;
                const radius = 110;
                const x = 125 + radius * Math.cos(angle);
                const y = 125 + radius * Math.sin(angle);
                const isStartTime = i === 0;

                return (
                  <g key={i}>
                    {isStartTime && (
                      <text
                        x={x}
                        y={y - 14}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={COLORS.time.startTime}
                        fontSize="10"
                        className="font-bold"
                      >
                        勤務開始
                      </text>
                    )}
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={COLORS.time.text}
                      fontSize="12"
                      className="font-semibold"
                    >
                      {getTimeLabel(i)}
                    </text>
                  </g>
                );
              })}

              {/* 目盛り */}
              {Array.from({ length: unitNum * getSubdivisions() }).map(
                (_, i) => {
                  const angle =
                    (i * Math.PI * 2) / (unitNum * getSubdivisions());
                  const isMainTick = i % getSubdivisions() === 0;
                  return (
                    <line
                      key={i}
                      x1={125 + (isMainTick ? 85 : 87) * Math.cos(angle)}
                      y1={125 + (isMainTick ? 85 : 87) * Math.sin(angle)}
                      x2={125 + 90 * Math.cos(angle)}
                      y2={125 + 90 * Math.sin(angle)}
                      stroke={isMainTick ? COLORS.ticks.main : COLORS.ticks.sub}
                      strokeWidth={isMainTick ? "2" : "1"}
                    />
                  );
                }
              )}

              {/* セクター */}
              {sectors.map((sector) => (
                <g key={sector.id}>
                  <path
                    d={describeArc(
                      125,
                      125,
                      90,
                      sector.startAngle,
                      sector.endAngle
                    )}
                    fill={sector.color}
                    className="cursor-move"
                    opacity={
                      isDraggingSector && selectedSector === sector.id
                        ? 0.7
                        : 0.9
                    }
                    onClick={(e) => handleSectorClick(e, sector)}
                    onMouseDown={(e) => handleSectorMouseDown(e, sector)}
                  />
                  {selectedSector === sector.id && (
                    <>
                      {/* ハンドル */}
                      {["start", "end"].map((type) => {
                        const angle =
                          type === "start"
                            ? sector.startAngle
                            : sector.endAngle;
                        return (
                          <g key={type} style={{ pointerEvents: "all" }}>
                            <circle
                              cx={125 + 90 * Math.cos(angle)}
                              cy={125 + 90 * Math.sin(angle)}
                              r="12"
                              className="handle-hitbox"
                              onMouseDown={(e) =>
                                handleHandleMouseDown(
                                  e,
                                  sector.id,
                                  type as "start" | "end"
                                )
                              }
                            />
                            <circle
                              cx={125 + 90 * Math.cos(angle)}
                              cy={125 + 90 * Math.sin(angle)}
                              r="6"
                              fill={COLORS.handles.fill}
                              stroke={COLORS.handles.stroke}
                              strokeWidth="2"
                              pointerEvents="none"
                            />
                          </g>
                        );
                      })}
                    </>
                  )}
                </g>
              ))}

              {/* プレビュー */}
              {dragPreview && (
                <path
                  d={describeArc(
                    125,
                    125,
                    90,
                    dragPreview.sector.startAngle,
                    dragPreview.sector.endAngle
                  )}
                  fill={
                    dragPreview.valid
                      ? COLORS.preview.valid
                      : COLORS.preview.invalid
                  }
                  className="pointer-events-none"
                />
              )}
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-6 min-w-[200px]">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400">固定項目</h3>
            <div className="space-y-2">
              {FIXED_TASKS.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(task)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded cursor-move hover:bg-gray-700 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.color }}
                  />
                  <span className="text-sm text-gray-200">{task.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400">タスク一覧</h3>
            <div className="space-y-2">
              {tasks
                .filter((task) => !task.isFixed)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(task)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded cursor-move hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <span className="text-sm text-gray-200">{task.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="primary"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          確定
        </Button>
      </div>

      <Modal
        title="タスク詳細"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check
            </label>
            <TextArea
              value={selectedSectorDetails.check}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedSectorDetails({
                  ...selectedSectorDetails,
                  check: e.target.value,
                })
              }
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do
            </label>
            <TextArea
              value={selectedSectorDetails.do}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedSectorDetails({
                  ...selectedSectorDetails,
                  do: e.target.value,
                })
              }
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plan
            </label>
            <TextArea
              value={selectedSectorDetails.plan}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedSectorDetails({
                  ...selectedSectorDetails,
                  plan: e.target.value,
                })
              }
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Action
            </label>
            <TextArea
              value={selectedSectorDetails.action}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedSectorDetails({
                  ...selectedSectorDetails,
                  action: e.target.value,
                })
              }
              rows={2}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportRegisterPage;
