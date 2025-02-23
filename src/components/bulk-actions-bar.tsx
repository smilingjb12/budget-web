import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { Row } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

export interface BulkAction<T> {
  label: string;
  icon: LucideIcon;
  onClick: (rows: Row<T>[]) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
}

interface BulkActionsBarProps<T> {
  selectedRows: Row<T>[];
  actions: BulkAction<T>[];
  minSelectedRows?: number;
}

export const BulkActionsBar = <T,>({
  selectedRows,
  actions,
  minSelectedRows = 2,
}: BulkActionsBarProps<T>) => {
  const isVisible = selectedRows.length >= minSelectedRows;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-primary px-6 py-5 shadow-[0_0_60px_0_rgba(0,0,0,0.3)] rounded-md transition-all duration-150 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ left: `calc(${Constants.SIDEBAR_WIDTH_PX} + 1.5rem)` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 pl-0">
          <div className="text-white">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-semibold">
                {selectedRows.length}
              </span>
              <span className="text-md text-background/80 leading-tight pl-2">
                items
                <br />
                selected
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant ?? "ghost"}
              size="lg"
              onClick={() => action.onClick(selectedRows)}
              className="gap-2 text-white"
            >
              <action.icon className="h-5 w-5" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
