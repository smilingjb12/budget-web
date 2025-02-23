import { BulkActionsBar, type BulkAction } from "@/components/bulk-actions-bar";
import { Row } from "@tanstack/react-table";
import { OctagonMinus, Trash2 } from "lucide-react";
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
  const actions: BulkAction<ItemDto>[] = [
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      variant: "ghost",
    },
    {
      label: "Withold items",
      icon: OctagonMinus,
      onClick: onWithhold,
      variant: "ghost",
    },
  ];

  return <BulkActionsBar selectedRows={selectedRows} actions={actions} />;
};
