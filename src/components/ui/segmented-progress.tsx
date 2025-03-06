"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export interface SegmentProps {
  value: number;
  color?: string;
  tooltip?: React.ReactNode;
  icon?: React.ReactNode;
}

interface SegmentedProgressProps {
  segments: SegmentProps[];
  className?: string;
  height?: number;
}

export function SegmentedProgress({
  segments,
  className,
  height = 24,
}: SegmentedProgressProps) {
  // Calculate total value to determine segment widths
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Default colors if none provided
  const defaultColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-primary",
  ];

  // Filter out segments with zero value
  const validSegments = segments.filter((segment) => segment.value > 0);

  // If no valid segments, show empty bar
  if (validSegments.length === 0 || totalValue <= 0) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        style={{ height: `${height}px` }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div className="flex h-full w-full">
        {validSegments.map((segment, index) => {
          const width = (segment.value / totalValue) * 100;
          const color =
            segment.color || defaultColors[index % defaultColors.length];

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "h-full flex items-center justify-center transition-all",
                      color
                    )}
                    style={{
                      width: `${width}%`,
                      minWidth: width > 0 ? "12px" : "0", // Ensure very small segments are still visible
                    }}
                  >
                    {segment.icon && width >= 5 && (
                      <div className="text-white">{segment.icon}</div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {segment.tooltip || `${segment.value} (${width.toFixed(1)}%)`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
