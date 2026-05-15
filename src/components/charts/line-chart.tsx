interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  color?: string;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}

export function LineChart({
  data,
  height = 200,
  className,
  color = "hsl(215 90% 52%)",
  showValues = true,
  formatValue,
}: LineChartProps) {
  if (!data || data.length === 0) return null;
  const width = 600;
  const padding = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...data.map((d) => d.value));
  const min = 0;
  const stepX = innerW / Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + innerH - ((d.value - min) / (max - min || 1)) * innerH;
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${points[points.length - 1].x},${padding.top + innerH} L${points[0].x},${padding.top + innerH} Z`;

  const yTicks = 4;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const y = padding.top + (innerH / yTicks) * i;
    const value = Math.round(max - (max / yTicks) * i);
    return { y, value };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      width="100%"
      height={height}
    >
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={g.y}
            y2={g.y}
            stroke="hsl(214 20% 88%)"
            strokeDasharray="3 4"
          />
          {showValues && (
            <text
              x={padding.left - 8}
              y={g.y + 3}
              textAnchor="end"
              fontSize="10"
              fill="hsl(215 14% 46%)"
            >
              {formatValue ? formatValue(g.value) : g.value}
            </text>
          )}
        </g>
      ))}

      <path d={area} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}

      {data.map((d, i) => (
        <text
          key={d.label}
          x={padding.left + i * stepX}
          y={height - 8}
          textAnchor="middle"
          fontSize="10"
          fill="hsl(215 14% 46%)"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
