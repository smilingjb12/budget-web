import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { Row } from "@tanstack/react-table";
import { Pause, Trash2 } from "lucide-react";
import { ItemDto } from "../../../../../../../convex/lib/types";

interface AuctionProgressBulkActionsBarProps {
  selectedRows: Row<ItemDto>[];
  onWithhold: (rows: Row<ItemDto>[]) => void;
  onDelete: (rows: Row<ItemDto>[]) => void;
}

export const AuctionProgressBulkActionsBar = ({
  selectedRows,
  onWithhold,
  onDelete,
}: AuctionProgressBulkActionsBarProps) => {
  const isVisible = selectedRows.length >= 2;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-primary px-6 py-5 shadow-[0_0_60px_0_rgba(0,0,0,0.3)] rounded-md transition-all duration-200 ease-in-out ${
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
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onDelete(selectedRows)}
            className="gap-2 rounded-full"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </Button>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => onWithhold(selectedRows)}
          className="gap-2 text-white"
        >
          <Pause className="h-5 w-5" />
          Withold items
        </Button>
      </div>
    </div>
  );
};
