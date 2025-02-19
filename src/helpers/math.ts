import { Sector } from "../pages/ReportRegisterPage";

export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = {
    x: x + radius * Math.cos(startAngle),
    y: y + radius * Math.sin(startAngle),
  };
  const end = {
    x: x + radius * Math.cos(endAngle),
    y: y + radius * Math.sin(endAngle),
  };
  const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} L ${x} ${y} Z`;
}

export function getPointOnCircle(
  xc: number,
  yc: number,
  r: number,
  unitNum: number,
  index: number
) {
  const anglePerSegment = (2 * Math.PI) / unitNum;
  const theta = index * anglePerSegment;
  const x = xc + r * Math.cos(theta);
  const y = yc + r * Math.sin(theta);
  return { x, y };
}
export const normalizeAngle = (angle: number): number => {
  let normalized = angle % (Math.PI * 2);
  return normalized < -Math.PI ? normalized + Math.PI * 2 : normalized;
};

export const checkSectorCollision = (
  sector1: Sector,
  sector2: Sector
): boolean => {
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

// 時間を分に変換する関数
export const timeToMinutes = (time: string | undefined | null): number => {
  if (!time || typeof time !== "string") return 0;

  try {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  } catch (error) {
    console.error("Invalid time format:", time);
    return 0;
  }
};

// 角度を計算する関数
export const calculateArc = (
  startTime: string,
  endTime: string,
  totalHours: number
) => {
  const totalMinutes = totalHours * 60;
  console.log(startTime);
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  // 開始角度と終了角度を計算（12時の位置を0度として）
  const startAngle = (start / totalMinutes) * 360 - 90;
  const endAngle = (end / totalMinutes) * 360 - 90;

  // SVGのArcパスを生成
  const radius = 50;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = radius * Math.cos(startRad);
  const y1 = radius * Math.sin(startRad);
  const x2 = radius * Math.cos(endRad);
  const y2 = radius * Math.sin(endRad);

  // 大きい弧かどうか（180度以上かどうか）
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return {
    path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    startPoint: `${x1},${y1}`,
    endPoint: `${x2},${y2}`,
  };
};
