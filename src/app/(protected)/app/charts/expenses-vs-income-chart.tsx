"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpensesVsIncomeQuery } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface ExpenseIncomeDataPoint {
  name: string;
  yearMonth: string;
  year: string;
  expenses: number;
  income: number;
  difference: number;
  isFirstMonthOfYear: boolean;
  absoluteDifference: number;
}

export function ExpensesVsIncomeChart() {
  const { data: rawExpensesVsIncome, isLoading } = useExpensesVsIncomeQuery();
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);

  // Add difference calculation to the data
  const expensesVsIncome = rawExpensesVsIncome?.map((item) => ({
    ...item,
    difference: item.income - item.expenses,
    // Add absolute difference for display purposes
    absoluteDifference: Math.abs(item.income - item.expenses),
  }));

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [, setVisibleData] = useState<typeof expensesVsIncome>([]);
  const [, setVisibleRange] = useState({ start: 0, end: 0 });
  const [, setCurrentYear] = useState<string | null>(null);

  // Calculate minimum width based on number of data points
  const minChartWidth = expensesVsIncome?.length
    ? Math.max(expensesVsIncome.length * 60, 300)
    : 300;

  // Calculate visible bars based on scroll position
  const updateVisibleData = useCallback(() => {
    if (!chartContainerRef.current || !expensesVsIncome?.length) return;

    const container = chartContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;

    // Calculate approximate visible range
    const barWidth = totalWidth / expensesVsIncome.length;
    const startIndex = Math.max(0, Math.floor(scrollLeft / barWidth));
    const visibleCount = Math.ceil(containerWidth / barWidth);
    const endIndex = Math.min(
      expensesVsIncome.length - 1,
      startIndex + visibleCount
    );

    // Update visible range
    setVisibleRange({ start: startIndex, end: endIndex });

    // Update visible data
    const newVisibleData = expensesVsIncome.slice(startIndex, endIndex + 1);
    setVisibleData(newVisibleData);

    // Update current year (use the middle item's year for context)
    if (newVisibleData.length > 0) {
      const middleIndex = Math.floor(newVisibleData.length / 2);
      setCurrentYear(newVisibleData[middleIndex]?.year || null);
    }
  }, [expensesVsIncome]);

  // Scroll to the right (most recent data) only on initial load
  useEffect(() => {
    if (
      chartContainerRef.current &&
      expensesVsIncome?.length &&
      !isLoading &&
      !hasInitiallyScrolled
    ) {
      // Small delay to ensure the chart is rendered
      setTimeout(() => {
        if (chartContainerRef.current) {
          chartContainerRef.current.scrollLeft =
            chartContainerRef.current.scrollWidth;
          updateVisibleData();
          setHasInitiallyScrolled(true);
        }
      }, 100);
    }
  }, [expensesVsIncome, isLoading, updateVisibleData, hasInitiallyScrolled]);

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
  }, [expensesVsIncome, updateVisibleData]);

  // Get year dividers for the chart
  const getYearDividers = () => {
    if (!expensesVsIncome?.length) return [];

    // Find indices where the year changes
    return expensesVsIncome
      .filter((item) => item.isFirstMonthOfYear)
      .map((item) => ({
        yearMonth: item.yearMonth,
        year: item.year,
      }));
  };

  const yearDividers = getYearDividers();

  // Custom tooltip to show the difference and its components
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0) {
      const dataPoint = payload[0].payload as ExpenseIncomeDataPoint;
      const differenceValue = dataPoint.difference;
      const expenseValue = dataPoint.expenses;
      const incomeValue = dataPoint.income;
      const year = dataPoint.year;

      return (
        <div className="bg-background/90 p-2 border border-border rounded-md shadow-md text-xs">
          <p className="font-medium">{`${label} ${year}`}</p>
          <p className="text-yellow-500">{`Expenses: ${formatCurrency(
            expenseValue || 0
          )}`}</p>
          <p className="text-green-500">{`Income: ${formatCurrency(
            incomeValue || 0
          )}`}</p>
          <p
            className={`font-medium ${
              differenceValue >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {`Balance: ${formatCurrency(differenceValue || 0)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
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
          ) : expensesVsIncome && expensesVsIncome.length > 0 ? (
            <div style={{ width: `${minChartWidth}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesVsIncome}
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

                  {/* Year dividers */}
                  {yearDividers.map((divider) => (
                    <ReferenceLine
                      key={divider.yearMonth}
                      x={expensesVsIncome.findIndex(
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

                  <Bar
                    name="Balance"
                    dataKey="absoluteDifference"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    {expensesVsIncome?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.difference >= 0
                            ? "hsl(142, 76%, 36%)"
                            : "hsl(35, 84%, 60%)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                No income vs expenses data available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
