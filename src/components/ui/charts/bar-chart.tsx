"use client";

import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

// Define the data item type
interface DataItem {
  name: string;
  total: number;
}

interface BarChartProps {
  data: Array<DataItem>;
  title?: string;
  description?: string;
  className?: string;
  height?: number;
}

export function BarChart({
  data,
  title,
  description,
  className,
  height = 300,
}: BarChartProps) {
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <ChartContainer
        config={{
          total: {
            label: "Total",
            theme: {
              light: "hsl(215 20.2% 65.1%)",
              dark: "hsl(215 20.2% 65.1%)",
            },
          },
        }}
      >
        <RechartsBarChart
          data={data}
          height={height}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => formatCurrency(value)}
            width={80}
          />
          <ChartTooltip
            content={({ active, payload }: TooltipProps<number, string>) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as DataItem;
                return (
                  <ChartTooltipContent
                    label={item.name}
                    formatter={(value) => [
                      formatCurrency(value as number),
                      "Total",
                    ]}
                  />
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
}
