import { Task } from "./pages/ReportRegisterPage";

export const appStyle = {
  siderWidth: "200px",
  height: "200px",
  border: "1px solid black",
};

export const appRoute = {
  dashboard: "dashboard",
  reportRegister: "/report-register",
  reportManage: "/report-manage",
  taskManage: "/task-manage",
  projectManage: "/project-manage",
  userManage: "/user-manage",
  attendManage: "/attend-manage",
  setting: "/settings",
  signup: "signup",
  signin: "signin",
};

export const COOKIES = {
  token: "pidica-token",
  email: "pidica-email",
  cd: "pidica-cd",
  name: "pidica-name",
  isLoggedin: "is-loggedin",
};

export const TASK_STATUS = {
  "1": "未着手",
  "2": "進行中",
  "3": "完了済",
};

export const REPORT_MODE = {
  PLAN: "0",
  ACTION: "1",
};

export const QURERY_PARAM = {
  DATE: "date",
  MODE: "mode",
};
export const REPORT_REGISTER_COLORS = {
  background: "#1A1A1A", // よりダークな背景
  circle: {
    stroke: "#404040", // ボーダー用のミディアムグレー
    fill: "black", // 深みのあるグレー
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

// 固定タスクの定義を更新
export const FIXED_TASKS: Task[] = [
  {
    name: "休憩",
    color: "#9CA3AF", // グレー
    isFixed: true,
    task_cd: "BREAK_001", // 固定のtask_cd
  },
  {
    name: "打合せ",
    color: "#6366F1", // インディゴ
    isFixed: true,
    task_cd: "MEET_001",
  },
  {
    name: "事務作業",
    color: "#10B981", // グリーン
    isFixed: true,
    task_cd: "DESK_001",
  },
  {
    name: "研修",
    color: "#F59E0B", // オレンジ
    isFixed: true,
    task_cd: "TRAIN_001",
  },
  {
    name: "移動",
    color: "#8B5CF6", // パープル
    isFixed: true,
    task_cd: "MOVE_001",
  },
];

export const ATTEND_SPECIAL_STATUS = {
  なし: "0",
  有給: "1",
  欠勤: "2",
  遅刻: "3",
  早退: "4",
};
export const ATTEND_SPECIAL_STATUS_REVERSE = {
  "0": "なし",
  "1": "有給",
  "2": "欠勤",
  "3": "遅刻",
  "4": "早退",
  "5": "欠勤",
};
