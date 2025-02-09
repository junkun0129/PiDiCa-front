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
