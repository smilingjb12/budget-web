"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncomeTrendsQuery } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

// Generate a color palette for the categories
const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff8042", // Orange
  "#0088fe", // Blue
  "#00C49F", // Teal
  "#FFBB28", // Gold
  "#FF8042", // Coral
  "#a4de6c", // Light Green
  "#d0ed57", // Lime
];

type ChartDataItem = {
  name: string;
  month: string;
  year: string;
  yearMonth: string;
  isFirstMonthOfYear: boolean;
  total: number;
  categories: Record<string, number>;
  [key: string]: string | number | boolean | Record<string, number>;
};

// Define a type for tooltip payload items
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  payload: ChartDataItem;
}

export function IncomeTrendsChart() {
  const { data: incomeTrendsData, isLoading } = useIncomeTrendsQuery();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [visibleData, setVisibleData] = useState<ChartDataItem[]>([]);
  const [, setVisibleRange] = useState({ start: 0, end: 0 });
  const [, setCurrentYear] = useState<string | null>(null);

  // Calculate minimum width based on number of data points
  const minChartWidth = incomeTrendsData?.data?.length
    ? Math.max(incomeTrendsData.data.length * 60, 300)
    : 300;

  // Calculate visible bars based on scroll position
  const updateVisibleData = useCallback(() => {
    if (!chartContainerRef.current || !incomeTrendsData?.data?.length) return;

    const container = chartContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;

    // Calculate approximate visible range
    const barWidth = totalWidth / incomeTrendsData.data.length;
    const startIndex = Math.max(0, Math.floor(scrollLeft / barWidth));
    const visibleCount = Math.ceil(containerWidth / barWidth);
    const endIndex = Math.min(
      incomeTrendsData.data.length - 1,
      startIndex + visibleCount
    );

    // Update visible range
    setVisibleRange({ start: startIndex, end: endIndex });

    // Update visible data
    const newVisibleData = incomeTrendsData.data.slice(
      startIndex,
      endIndex + 1
    );
    setVisibleData(newVisibleData as ChartDataItem[]);

    // Update current year (use the middle item's year for context)
    if (newVisibleData.length > 0) {
      const middleIndex = Math.floor(newVisibleData.length / 2);
      setCurrentYear(newVisibleData[middleIndex]?.year || null);
    }
  }, [incomeTrendsData]);

  // Scroll to the right (most recent data) when data changes
  useEffect(() => {
    if (
      chartContainerRef.current &&
      incomeTrendsData?.data?.length &&
      !isLoading
    ) {
      // Small delay to ensure the chart is rendered
      setTimeout(() => {
        if (chartContainerRef.current) {
          chartContainerRef.current.scrollLeft =
            chartContainerRef.current.scrollWidth;
          updateVisibleData();
        }
      }, 100);
    }
  }, [incomeTrendsData, isLoading, updateVisibleData]);

  // Update visible data when scrolling
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateVisibleData();
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [incomeTrendsData, updateVisibleData]);

  // Get year dividers for the chart
  const getYearDividers = () => {
    if (!incomeTrendsData?.data?.length) return [];

    // Find indices where the year changes
    return incomeTrendsData.data
      .filter((item) => item.isFirstMonthOfYear)
      .map((item) => ({
        yearMonth: item.yearMonth,
        year: item.year,
      }));
  };

  const yearDividers = getYearDividers();

  // Create data for stacked bar chart
  const getStackedData = () => {
    if (!incomeTrendsData?.data) return [];

    return incomeTrendsData.data.map((item) => {
      const result: ChartDataItem = {
        name: item.name,
        month: item.month,
        year: item.year,
        yearMonth: item.yearMonth,
        isFirstMonthOfYear: item.isFirstMonthOfYear,
        total: item.total,
        categories: item.categories || {},
      };

      // Add each category as a separate key
      if (item.categories) {
        Object.entries(item.categories).forEach(([category, value]) => {
          result[category] = value;
        });
      }

      return result;
    });
  };

  const stackedData = getStackedData();

  // Custom tooltip for the stacked bar chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0) {
      const typedPayload = payload as TooltipPayloadItem[];
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-bold">{`${label} ${
            typedPayload[0]?.payload?.year || ""
          }`}</p>
          <p className="font-semibold text-primary">{`Total: ${formatCurrency(
            typedPayload[0]?.payload?.total || 0
          )}`}</p>
          <div className="mt-1">
            {typedPayload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>
                  {entry.name}: {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={chartContainerRef}
          className="h-[300px] overflow-x-auto"
          onScroll={updateVisibleData}
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : stackedData && stackedData.length > 0 ? (
            <div style={{ width: `${minChartWidth}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stackedData}
                  margin={{ top: 20, right: 5, left: 5, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(var(--muted-foreground), 0.1)"
                    strokeOpacity={0.2}
                  />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => formatCurrency(value)}
                    domain={
                      visibleData && visibleData.length > 0
                        ? [
                            0,
                            Math.max(...visibleData.map((item) => item.total)) *
                              1.1,
                          ]
                        : undefined
                    }
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.2)" }}
                  />
                  <Legend />

                  {/* Year dividers */}
                  {yearDividers.map((divider) => (
                    <ReferenceLine
                      key={divider.yearMonth}
                      x={stackedData.findIndex(
                        (item) => item.yearMonth === divider.yearMonth
                      )}
                      stroke="hsl(var(--primary))"
                      strokeOpacity={0.5}
                      strokeWidth={1}
                      label={{
                        value: divider.year,
                        position: "insideTopRight",
                        fill: "hsl(var(--primary))",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                  ))}

                  {/* Create a stacked bar for each category */}
                  {incomeTrendsData?.categories?.map((category, index) => (
                    <Bar
                      key={category}
                      dataKey={category}
                      stackId="a"
                      fill={COLORS[index % COLORS.length]}
                      radius={
                        index === incomeTrendsData.categories.length - 1
                          ? [4, 4, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      maxBarSize={40}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No income data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
