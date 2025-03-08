"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncomeTrendsQuery } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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

// Format currency without decimal places
const formatCurrencyNoDecimals = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom label formatter for the total amount
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomizedLabel = (props: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { x, y, width, value } = props;

  // Convert values to numbers to ensure proper calculations
  const xPos = Number(x || 0);
  const yPos = Number(y || 0);
  const widthVal = Number(width || 0);
  const numValue = Number(value || 0);

  return (
    <text
      x={xPos + widthVal / 2}
      y={yPos - 10}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-white text-sm font-bold"
      filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))"
    >
      {formatCurrencyNoDecimals(numValue)}
    </text>
  );
};

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

  // Calculate the maximum value for the Y-axis with some padding
  const maxValue = useMemo(() => {
    if (!yearlyData.length) return 0;
    const max = Math.max(...yearlyData.map((item) => item.total));
    return max * 1.2; // Add 20% padding for the labels
  }, [yearlyData]);

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
                margin={{ top: 30, right: 5, left: 5, bottom: 20 }}
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
                  tickFormatter={(value: number) =>
                    formatCurrencyNoDecimals(value)
                  }
                  domain={[0, maxValue]}
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
                  >
                    {/* Only add the label to the last (top) bar in the stack */}
                    {index === incomeTrendsData.categories.length - 1 && (
                      <LabelList
                        dataKey="total"
                        position="top"
                        content={renderCustomizedLabel}
                      />
                    )}
                  </Bar>
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
