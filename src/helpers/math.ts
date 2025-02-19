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
    if (time.includes("-")) {
      const [hours, minutes] = time.split(":").map(Number);
      console.log(hours, minutes);
      return hours * 60 + minutes;
    } else {
      return parseInt(time);
    }
  } catch (error) {
    console.error("Invalid time format:", time);
    return 0;
  }
};

export const calculateArc = (
  startTime: string,
  endTime: string,
  totalHours: number,
  startHour: number,
  radius: number
): string => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  // 開始時間からの相対位置を計算
  const relativeStart = start - startHour;
  const relativeEnd = end - startHour;

  // 角度に変換（12時位置が0度、時計回り）
  const startAngle = (relativeStart / totalHours) * Math.PI * 2 - Math.PI / 2;
  const endAngle = (relativeEnd / totalHours) * Math.PI * 2 - Math.PI / 2;

  // 円弧の開始点と終了点（中心が0,0の座標系で計算）
  const startX = radius * Math.cos(startAngle);
  const startY = radius * Math.sin(startAngle);
  const endX = radius * Math.cos(endAngle);
  const endY = radius * Math.sin(endAngle);

  // 大きい弧かどうか（180度以上かどうか）
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

  // SVGのパスを生成（中心点(0,0)を基準に）
  return `M 0 0 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
};
