import { RecordDto } from "@/app/api/(services)/record-service";
import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month } from "@/lib/routes";
import { formatUSD } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
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
}

export function CategoryRecords({
  categoryName,
  categoryId,
  year,
  month,
  totalExpenses,
  icon,
  difference,
}: CategoryRecordsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCategoryIcon } = useCategoryIcon();
  const IconComponent = getCategoryIcon(icon);

  // Only fetch records when the category is expanded
  const { data: records, isLoading } = useQuery<RecordDto[]>({
    queryKey: QueryKeys.monthRecords(year, month),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.allRecordsByMonth(year, month));
      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }
      return response.json() as Promise<RecordDto[]>;
    },
    enabled: isExpanded, // Only fetch when expanded
  });

  // Filter records by category
  const categoryRecords =
    records?.filter((record) => record.categoryId === categoryId) || [];

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
          {formatUSD(totalExpenses)}
          {difference && (
            <span className={`flex items-center text-sm ${difference.color}`}>
              {difference.text}
              {difference.icon}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </div>

      {isExpanded && (
        <div className="pl-6 space-y-2 slide-in-from-top-2 duration-200">
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
                  trigger={
                    <div className="flex justify-between items-center py-2 px-6 text-sm border border-border rounded-md cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <span className="text-md text-muted-foreground">
                          {format(
                            parseISO(record.dateUtc),
                            "MMM d, yyyy h:mm a"
                          )}
                        </span>
                        <span className="font-medium text-lg">
                          {formatUSD(record.value)}
                        </span>
                        {record.comment && (
                          <span className="text-muted-foreground">
                            {record.comment}
                          </span>
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
