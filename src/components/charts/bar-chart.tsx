interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  color?: string;
  formatValue?: (v: number) => string;
}

export function BarChart({
  data,
  height = 220,
  className,
  color = "hsl(215 90% 52%)",
  formatValue,
}: BarChartProps) {
  if (!data || data.length === 0) return null;
  const width = 600;
  const padding = { top: 16, right: 16, bottom: 32, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...data.map((d) => d.value));
  const slot = innerW / data.length;
  const barW = slot * 0.55;

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
          <text
            x={padding.left - 8}
            y={g.y + 3}
            textAnchor="end"
            fontSize="10"
            fill="hsl(215 14% 46%)"
          >
            {formatValue ? formatValue(g.value) : g.value}
          </text>
        </g>
      ))}

      {data.map((d, i) => {
        const h = ((d.value || 0) / (max || 1)) * innerH;
        const x = padding.left + slot * i + (slot - barW) / 2;
        const y = padding.top + innerH - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={h} rx={3} fill={color} />
            <text
              x={padding.left + slot * i + slot / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(215 14% 46%)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
