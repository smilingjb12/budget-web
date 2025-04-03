"use client";

import { Month } from "@/lib/routes";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AddRecordDialog } from "./add-record-dialog";
import { MonthlyHeader, ViewType } from "./monthly-header";
import { MonthlySummaryCard } from "./monthly-summary-card";

export default function MonthYearPage() {
  const [viewType, setViewType] = useState<ViewType>("expenses");
  const params = useParams<{ month: string; year: string }>();
  const month = Number(params.month) as Month;
  const year = Number(params.year);

  const handleToggleViewType = () => {
    setViewType((prev) => (prev === "expenses" ? "income" : "expenses"));
  };

  return (
    <div className="p-0 space-y-4 relative">
      <MonthlyHeader
        viewType={viewType}
        onToggleViewType={handleToggleViewType}
        month={month}
        year={year}
      />

      <MonthlySummaryCard viewType={viewType} />

      <div className="fixed bottom-20 right-10 z-50">
        <AddRecordDialog isIncome={viewType === "income"} />
      </div>
    </div>
  );
}
