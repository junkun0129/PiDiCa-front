import React, { useEffect, useRef, useState } from "react";
import {
  checkSectorCollision,
  describeArc,
  getPointOnCircle,
  normalizeAngle,
} from "../helpers/math";
import { Modal, Input, Button, Result, Pagination } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  appRoute,
  FIXED_TASKS,
  QURERY_PARAM,
  REPORT_REGISTER_COLORS,
} from "../const";
import { createReportApi } from "../api/report.api";
import { getTaskListApi } from "../api/task.api";
import WorkHourSelect from "../components/inputs/WorkHourSelect";
import TimeUnitChanger from "../components/inputs/TimeUnitChanger";
import WorkStartTimeChanger from "../components/inputs/WorkStartTimeChanger";
import Sector from "../components/shapes/Sector";
import EditSectorModal from "../components/modals/EditSectorModal";
export interface Task {
  name: string;
  color: string;
  isFixed?: boolean;
  task_cd?: string;
}

export interface Sector {
  id: string;
  task_name: string;
  task_cd: string;
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface SectorDetail {
  check: string;
  do: string;
  plan: string;
  action: string;
}

export interface DragPreview {
  sector: Sector;
  valid: boolean;
}

const ReportRegisterPage = () => {
  // 状態の型を明示的に指定
  const [tasks, setTasks] = useState<Task[]>(FIXED_TASKS);
  const navigate = useNavigate();

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [unitNum, setUnitNum] = useState(8);
  const [minuteGranularity, setMinuteGranularity] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const [serachParams] = useSearchParams();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<
    "start" | "end" | "move" | null
  >(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [dragPreviewAngle, setDragPreviewAngle] = useState<number | null>(null);
  const [isDraggingSector, setIsDraggingSector] = useState(false);
  const [isReportSubmmited, setisReportSubmmited] = useState(false);

  const [offset, setoffset] = useState(0);
  const [total, settotal] = useState(0);
  const [pagination, setpagination] = useState(10);
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

  // APIからタスクを取得する処理
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTaskListApi({
          offset,
          pagination,
          sort: "asc;created_at",
          project: "",
        });
        console.log(res);
        // const apiTasks = await fetchTasksFromAPI();
        const newTasks: Task[] = res.data.map((item: any) => {
          return {
            name: item.task_name,
            color: "gray",
            isFixed: false,
            task_cd: item.task_cd,
          };
        });
        setTasks([...FIXED_TASKS, ...newTasks]);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const formatTime = (angle: number): string => {
    // デバッグ用にコンソール出力
    console.log("Input angle:", angle);

    // 角度を[0, 2π]の範囲に正規化（12時の位置を0とする）
    let normalizedAngle = angle;
    while (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
    while (normalizedAngle >= Math.PI * 2) normalizedAngle -= Math.PI * 2;

    // 12時の位置（-π/2）を0とするように調整
    let timeAngle = normalizedAngle + Math.PI / 2;
    if (timeAngle >= Math.PI * 2) timeAngle -= Math.PI * 2;

    // 1時間あたりの分割数を計算
    const divisionsPerHour = 60 / minuteGranularity;

    // 全体の区画数を計算
    const totalDivisions = unitNum * divisionsPerHour;

    // 角度から区画インデックスを計算
    const index = Math.round((timeAngle / (Math.PI * 2)) * totalDivisions);

    // 時と分を計算
    const hourIndex = Math.floor(index / divisionsPerHour);
    const minuteIndex = index % divisionsPerHour;

    const hour = (startHour + hourIndex) % 24;
    const minutes = minuteIndex * minuteGranularity;

    return `${hour.toString().padStart(2, "0")}-${minutes
      .toString()
      .padStart(2, "0")}`;
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

    const normalizedStartAngle = normalizeAngle(angle);
    if (normalizedStartAngle < -Math.PI / 2 && normalizedStartAngle > -Math.PI)
      return;

    const sectorWidth = (Math.PI * 2) / unitNum;

    const newSector: Sector = {
      id: draggedTask.task_cd || "",
      task_name: "",
      startAngle: angle,
      endAngle: normalizeAngle(angle + sectorWidth),
      color: draggedTask.color,
      task_cd: draggedTask.task_cd || "",
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

  // 確定ボタンの処理を更新
  const handleSubmit = async () => {
    const reportItems = sectors.map((sector) => {
      const details = sectorDetails[sector.id] || {
        check: "",
        do: "",
        plan: "",
        action: "",
      };

      return {
        task_cd: sector.task_cd, // task_cdを使用
        starttime: formatTime(sector.startAngle),
        endtime: formatTime(sector.endAngle),
        ...details,
      };
    });

    const reportData = {
      report_workhour: unitNum.toString(),
      report_date: serachParams.get(QURERY_PARAM.DATE) || "",
      report_status: serachParams.get(QURERY_PARAM.MODE) || "",
      report_items: reportItems,
    };

    const res = await createReportApi({ body: reportData });
    if (res.result === "success") {
      console.log("作成に成功しました");
      setisReportSubmmited(true);
    } else {
      console.log("作成に失敗しました");
    }

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
    <div className="flex flex-col h-screen">
      {isReportSubmmited ? (
        <Result
          title="提出成功"
          status="success"
          subTitle={
            <Button
              onClick={(e) => {
                navigate(appRoute.reportManage);
              }}
            >
              日報管理画面へ戻る
            </Button>
          }
        ></Result>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row h-[calc(100vh-3rem)] -mt-5">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-x-4 gap-y-1 p-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <WorkHourSelect unitNum={unitNum} setUnitNum={setUnitNum} />
                </div>
                <div className="flex items-center gap-2">
                  <TimeUnitChanger
                    minuteGranularity={minuteGranularity}
                    setMinuteGranularity={setMinuteGranularity}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <WorkStartTimeChanger
                    startHour={startHour}
                    setStartHour={setStartHour}
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-2 min-h-0">
                <div
                  ref={containerRef}
                  className="relative w-full h-full rounded-lg select-none"
                  style={{
                    maxWidth: "85%",
                    aspectRatio: "1/1",
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleBackgroundClick}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 250 250"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <circle
                      cx="125"
                      cy="125"
                      r="90"
                      stroke={REPORT_REGISTER_COLORS.circle.stroke}
                      strokeWidth="2"
                      fill={REPORT_REGISTER_COLORS.circle.fill}
                    />

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
                              fill={REPORT_REGISTER_COLORS.time.startTime}
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
                            fill={REPORT_REGISTER_COLORS.time.text}
                            fontSize="12"
                            className="font-semibold"
                          >
                            {getTimeLabel(i)}
                          </text>
                        </g>
                      );
                    })}

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
                            stroke={
                              isMainTick
                                ? REPORT_REGISTER_COLORS.ticks.main
                                : REPORT_REGISTER_COLORS.ticks.sub
                            }
                            strokeWidth={isMainTick ? "2" : "1"}
                          />
                        );
                      }
                    )}

                    {sectors.map((sector, i) => (
                      <Sector
                        key={i + "sector"}
                        startAngle={sector.startAngle}
                        endAngle={sector.endAngle}
                        color={sector.color}
                        x={125}
                        y={125}
                        radius={90}
                        isSectorDragging={
                          isDraggingSector && selectedSector === sector.id
                        }
                        isSectorSelected={selectedSector === sector.id}
                        onSectorClick={(e) => handleSectorClick(e, sector)}
                        onSectorMouseDown={(e) =>
                          handleSectorMouseDown(e, sector)
                        }
                        onHandleMouseDown={(e, type) =>
                          handleHandleMouseDown(e, sector.id, type)
                        }
                      />
                    ))}

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
                            ? REPORT_REGISTER_COLORS.preview.valid
                            : REPORT_REGISTER_COLORS.preview.invalid
                        }
                        className="pointer-events-none"
                      />
                    )}
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full lg:w-[400px] flex-shrink-0">
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">
                  固定項目
                </h3>
                <div className="flex flex-wrap gap-1">
                  {FIXED_TASKS.map((task) => (
                    <div
                      key={task.task_cd}
                      draggable
                      onDragStart={(e) => handleTaskDragStart(task)}
                      className="flex items-center gap-2 shadow-md px-4 py-2 rounded cursor-move hover:bg-gray-200 transition-colors"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.color }}
                      />
                      <span className="text-sm text-gray-500">{task.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  タスク一覧
                </h3>
                <div className="space-y-1">
                  {tasks
                    .filter((task) => !task.isFixed)
                    .map((task) => (
                      <div
                        key={task.task_cd}
                        draggable
                        onDragStart={() => handleTaskDragStart(task)}
                        className="flex items-center gap-2 px-4 py-2 rounded shadow-md cursor-move hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-sm text-gray-500">
                          {task.name}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="mt-2">
                  <Pagination
                    pageSize={pagination}
                    current={offset / pagination + 1}
                    total={total}
                    onChange={(page, pageSize) => {
                      setpagination(pageSize);
                      setoffset((page - 1) * pageSize);
                    }}
                    size="small"
                  />
                </div>
                <div className="flex justify-end p-2 ">
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    確定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <EditSectorModal
        ModalProps={{
          open: isModalVisible,
          onOk: handleModalOk,
          onCancel: () => setIsModalVisible(false),
        }}
        SectorDetail={selectedSectorDetails}
        onChange={(value, type) => {
          setSelectedSectorDetails({
            ...selectedSectorDetails,
            [type]: value,
          });
        }}
      />
    </div>
  );
};

export default ReportRegisterPage;
