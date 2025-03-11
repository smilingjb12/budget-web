"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCategoryExpensesQuery,
  useExpenseCategoriesQuery,
} from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function ExpenseTrendsChart() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const { data: categories, isLoading: isCategoriesLoading } =
    useExpenseCategoriesQuery();
  const { data: categoryExpenses, isLoading: isExpensesLoading } =
    useCategoryExpensesQuery(selectedCategoryId || 0);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [visibleData, setVisibleData] = useState<typeof categoryExpenses>([]);
  const [, setVisibleRange] = useState({ start: 0, end: 0 });
  const [, setCurrentYear] = useState<string | null>(null);

  // Calculate minimum width based on number of data points
  const minChartWidth = categoryExpenses?.length
    ? Math.max(categoryExpenses.length * 60, 300)
    : 300;

  // Calculate visible bars based on scroll position
  const updateVisibleData = useCallback(() => {
    if (!chartContainerRef.current || !categoryExpenses?.length) return;

    const container = chartContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;

    // Calculate approximate visible range
    const barWidth = totalWidth / categoryExpenses.length;
    const startIndex = Math.max(0, Math.floor(scrollLeft / barWidth));
    const visibleCount = Math.ceil(containerWidth / barWidth);
    const endIndex = Math.min(
      categoryExpenses.length - 1,
      startIndex + visibleCount
    );

    // Update visible range
    setVisibleRange({ start: startIndex, end: endIndex });

    // Update visible data
    const newVisibleData = categoryExpenses.slice(startIndex, endIndex + 1);
    setVisibleData(newVisibleData);

    // Update current year (use the middle item's year for context)
    if (newVisibleData.length > 0) {
      const middleIndex = Math.floor(newVisibleData.length / 2);
      setCurrentYear(newVisibleData[middleIndex]?.year || null);
    }
  }, [categoryExpenses]);

  // Scroll to the right (most recent data) when category is selected or data changes
  useEffect(() => {
    if (
      chartContainerRef.current &&
      categoryExpenses?.length &&
      !isExpensesLoading
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
  }, [
    categoryExpenses,
    isExpensesLoading,
    selectedCategoryId,
    updateVisibleData,
  ]);

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
  }, [categoryExpenses, updateVisibleData]);

  // Get year dividers for the chart
  const getYearDividers = () => {
    if (!categoryExpenses?.length) return [];

    // Find indices where the year changes
    return categoryExpenses
      .filter((item) => item.isFirstMonthOfYear)
      .map((item) => ({
        yearMonth: item.yearMonth,
        year: item.year,
      }));
  };

  const yearDividers = getYearDividers();

  // Function to determine color based on value
  const getBarColor = (value: number, data: typeof categoryExpenses) => {
    if (!data || data.length === 0) return "hsl(var(--primary))";

    const values = data.map((item) => item.total);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Normalize the value to a 0-1 scale
    const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;

    // Define color stops for the gradient
    const colorStops = [
      { point: 0, color: { h: 142, s: 76, l: 36 } }, // Green (low)
      { point: 0.5, color: { h: 35, s: 92, l: 58 } }, // Yellow/Orange (middle)
      { point: 1, color: { h: 0, s: 84, l: 60 } }, // Red (high)
    ];

    // Find the two color stops to interpolate between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (
        normalizedValue >= colorStops[i].point &&
        normalizedValue <= colorStops[i + 1].point
      ) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // Calculate how far between the two stops the value is (0 to 1)
    const stopRange = upperStop.point - lowerStop.point;
    const stopFraction =
      stopRange === 0 ? 0 : (normalizedValue - lowerStop.point) / stopRange;

    // Interpolate between the two colors
    const h = Math.round(
      lowerStop.color.h + stopFraction * (upperStop.color.h - lowerStop.color.h)
    );
    const s = Math.round(
      lowerStop.color.s + stopFraction * (upperStop.color.s - lowerStop.color.s)
    );
    const l = Math.round(
      lowerStop.color.l + stopFraction * (upperStop.color.l - lowerStop.color.l)
    );

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Select
            value={selectedCategoryId?.toString() || ""}
            onValueChange={(value) =>
              setSelectedCategoryId(parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {isCategoriesLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : (
                categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div
          ref={chartContainerRef}
          className="h-[300px] overflow-x-auto"
          onScroll={updateVisibleData}
        >
          {selectedCategoryId ? (
            isExpensesLoading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : categoryExpenses && categoryExpenses.length > 0 ? (
              <div style={{ width: `${minChartWidth}px`, height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryExpenses}
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
                              Math.max(
                                ...visibleData.map((item) => item.total)
                              ) * 1.1,
                            ]
                          : undefined
                      }
                    />

                    {/* Year dividers */}
                    {yearDividers.map((divider) => (
                      <ReferenceLine
                        key={divider.yearMonth}
                        x={categoryExpenses.findIndex(
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

                    <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {categoryExpenses &&
                        categoryExpenses.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getBarColor(entry.total, categoryExpenses)}
                          />
                        ))}
                      <LabelList
                        dataKey="total"
                        position="top"
                        formatter={(value: number) =>
                          formatCurrency(Math.round(value)).replace(/\.\d+/, "")
                        }
                        style={{
                          fontSize: "12px",
                          fill: "white",
                          fontWeight: "normal",
                        }}
                        className="text-foreground"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  No data available for this category
                </p>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a category to view expense trends
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
