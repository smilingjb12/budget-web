import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { useMonthRecordsQuery } from "@/lib/queries";
import { Month } from "@/lib/routes";
import { formatUSD } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { AddRecordDialog } from "./add-record-dialog";

interface CategoryRecordsProps {
  categoryName: string;
  categoryId: number;
  year: number;
  month: Month;
  totalExpenses: number;
  icon: string;
  difference?: {
    text: string;
    color: string;
    icon?: React.ReactNode;
  };
  isExpense?: boolean;
}

export function CategoryRecords({
  categoryName,
  categoryId,
  year,
  month,
  totalExpenses,
  icon,
  difference,
  isExpense = true,
}: CategoryRecordsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCategoryIcon } = useCategoryIcon();
  const IconComponent = getCategoryIcon(icon);

  // Only fetch records when the category is expanded
  const { data: records, isLoading } = useMonthRecordsQuery(
    year,
    month,
    isExpanded
  );

  // Filter records by category and expense/income type
  const categoryRecords =
    records?.filter(
      (record) =>
        record.categoryId === categoryId && record.isExpense === isExpense
    ) || [];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <div
        className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
        onClick={toggleExpand}
      >
        <span className="flex items-center">
          <IconComponent className="mr-2 size-5" />
          {categoryName}
        </span>
        <span className="flex items-center gap-2">
          {difference && (
            <span className={`flex items-center text-xs ${difference.color}`}>
              {difference.text}
              {difference.icon}
            </span>
          )}
          {formatUSD(totalExpenses)}
        </span>
      </div>

      {isExpanded && (
        <div className="pl-0 space-y-2 slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading records...
            </div>
          ) : categoryRecords.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No records found
            </div>
          ) : (
            <div className="space-y-2">
              {categoryRecords.map((record) => (
                <AddRecordDialog
                  key={record.id}
                  recordId={record.id}
                  isIncome={!isExpense}
                  trigger={
                    <div className="flex justify-between items-center py-2 px-3 text-sm border border-border rounded-md cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-md text-muted-foreground">
                              {format(
                                parseISO(record.dateUtc),
                                "MMM d, yyyy HH:mm"
                              )}
                            </span>
                          </div>
                          <span className="font-medium text-md">
                            {formatUSD(record.value)}
                          </span>
                        </div>
                        {record.comment && (
                          <div className="mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-secondary-foreground/90">
                                {record.comment}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
