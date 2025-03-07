"use client";

import { ExpenseTrendsChart } from "./expense-trends-chart";
import { ExpensesVsIncomeChart } from "./expenses-vs-income-chart";

export default function ChartsPage() {
  return (
    <div className="py-1 space-y-4">
      <h1 className="text-xl font-bold mb-6 px-4">Charts</h1>

      <ExpenseTrendsChart />

      <ExpensesVsIncomeChart />
    </div>
  );
}
