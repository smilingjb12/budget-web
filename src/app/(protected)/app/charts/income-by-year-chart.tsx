"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncomeTrendsQuery } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

type YearlyDataItem = {
  name: string;
  year: string;
  total: number;
  categories: Record<string, number>;
  [key: string]: string | number | Record<string, number>;
};

// Define a type for tooltip payload items
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  payload: YearlyDataItem;
}

export function IncomeByYearChart() {
  const { data: incomeTrendsData, isLoading } = useIncomeTrendsQuery();

  // Aggregate data by year
  const yearlyData = useMemo(() => {
    if (!incomeTrendsData?.data) return [];

    // Group data by year
    const yearlyAggregation: Record<string, YearlyDataItem> = {};

    incomeTrendsData.data.forEach((item) => {
      const year = item.year;

      if (!yearlyAggregation[year]) {
        yearlyAggregation[year] = {
          name: year,
          year,
          total: 0,
          categories: {},
        };
      }

      // Add to total
      yearlyAggregation[year].total += item.total;

      // Add to categories
      if (item.categories) {
        Object.entries(item.categories).forEach(([category, value]) => {
          if (!yearlyAggregation[year].categories[category]) {
            yearlyAggregation[year].categories[category] = 0;
          }
          yearlyAggregation[year].categories[category] += value;
        });
      }
    });

    // Convert to array and sort by year
    return Object.values(yearlyAggregation).sort((a, b) =>
      a.year.localeCompare(b.year)
    );
  }, [incomeTrendsData]);

  // Create data for stacked bar chart
  const getStackedData = () => {
    if (!yearlyData.length) return [];

    return yearlyData.map((item) => {
      const result: YearlyDataItem = {
        name: item.name,
        year: item.year,
        total: item.total,
        categories: item.categories,
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
          <p className="font-bold">{`Year: ${label}`}</p>
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
        <CardTitle>Income by Year</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : stackedData && stackedData.length > 0 ? (
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
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.2)" }}
                />
                <Legend />

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
                    maxBarSize={80}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
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
