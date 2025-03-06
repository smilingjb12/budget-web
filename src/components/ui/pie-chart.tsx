"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface PieChartSegmentProps {
  value: number;
  color?: string;
  label?: string;
}

export const PieChartSegment: React.FC<PieChartSegmentProps> = ({
  value,
  color,
  label,
}) => {
  return null; // This is just a data component, rendering is handled by PieChart
};

interface PieChartProps {
  segments?: PieChartSegmentProps[];
  className?: string;
  size?: number;
  children?: React.ReactNode;
}

export function PieChart({
  segments: propSegments,
  className,
  size = 200,
  children,
}: PieChartProps) {
  // Extract segments from children if provided
  const childSegments = React.Children.toArray(children)
    .filter(
      (child) => React.isValidElement(child) && child.type === PieChartSegment
    )
    .map((child) => {
      const segment = child as React.ReactElement<PieChartSegmentProps>;
      return {
        value: segment.props.value,
        label: segment.props.label || "",
        color: segment.props.color,
      };
    });

  // Use either prop segments or child segments
  const segments = propSegments || childSegments;

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  // If there's no data, show an empty circle
  if (total === 0) {
    return (
      <div
        className={cn("relative rounded-full bg-muted", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  // Calculate the segments
  let cumulativePercent = 0;
  const chartSegments = segments.map((segment, index) => {
    const startPercent = cumulativePercent;
    const segmentPercent = (segment.value / total) * 100;
    cumulativePercent += segmentPercent;

    // Use predefined chart colors or fallback to a default
    const colorVar = segment.color || `var(--chart-${(index % 5) + 1})`;

    return {
      ...segment,
      startPercent,
      endPercent: cumulativePercent,
      color: colorVar,
    };
  });

  return (
    <div
      className={cn("relative rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {chartSegments.map((segment, index) => {
        const startAngle = (segment.startPercent / 100) * 360;
        const endAngle = (segment.endPercent / 100) * 360;
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        // Calculate coordinates for the SVG path
        const startX =
          size / 2 + (size / 2) * Math.cos((startAngle - 90) * (Math.PI / 180));
        const startY =
          size / 2 + (size / 2) * Math.sin((startAngle - 90) * (Math.PI / 180));
        const endX =
          size / 2 + (size / 2) * Math.cos((endAngle - 90) * (Math.PI / 180));
        const endY =
          size / 2 + (size / 2) * Math.sin((endAngle - 90) * (Math.PI / 180));

        // Create the SVG path
        const path = `
          M ${size / 2} ${size / 2}
          L ${startX} ${startY}
          A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${endX} ${endY}
          Z
        `;

        return (
          <svg
            key={index}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute top-0 left-0"
          >
            <path d={path} fill={segment.color} />
          </svg>
        );
      })}

      {/* Center hole (optional) */}
      <div
        className="absolute rounded-full bg-background"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          top: size * 0.2,
          left: size * 0.2,
        }}
      />
    </div>
  );
}
