"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { PieChartSegmentProps } from "./pie-chart";

interface ChartLegendItemProps {
  label: string;
  color: string;
  value?: number;
  percentage?: number;
}

const ChartLegendItem: React.FC<ChartLegendItemProps> = ({
  label,
  color,
  value,
  percentage,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex gap-2 text-sm">
        {value !== undefined && (
          <span className="font-medium">${value.toFixed(2)}</span>
        )}
        {percentage !== undefined && (
          <span className="text-muted-foreground">
            ({percentage.toFixed(1)}%)
          </span>
        )}
      </div>
    </div>
  );
};

interface ChartLegendProps {
  segments?: PieChartSegmentProps[];
  className?: string;
  showValues?: boolean;
  showPercentages?: boolean;
  children?: React.ReactNode;
}

export function ChartLegend({
  segments,
  className,
  showValues = true,
  showPercentages = true,
  children,
}: ChartLegendProps) {
  // If children are provided, render them directly
  if (children) {
    return <div className={cn("space-y-2", className)}>{children}</div>;
  }

  // Otherwise, use the segments prop
  if (!segments || segments.length === 0) {
    return null;
  }

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Calculate colors for segments
  const legendItems = segments.map((segment, index) => {
    const colorVar = segment.color || `var(--chart-${(index % 5) + 1})`;
    const percentage = total > 0 ? (segment.value / total) * 100 : 0;

    return {
      ...segment,
      color: colorVar,
      percentage,
    };
  });

  return (
    <div className={cn("space-y-2", className)}>
      {legendItems.map((item, index) => (
        <ChartLegendItem
          key={index}
          label={item.label || `Item ${index + 1}`}
          color={item.color}
          value={showValues ? item.value : undefined}
          percentage={showPercentages ? item.percentage : undefined}
        />
      ))}
    </div>
  );
}

// Add Item as a static property
ChartLegend.Item = ChartLegendItem;
