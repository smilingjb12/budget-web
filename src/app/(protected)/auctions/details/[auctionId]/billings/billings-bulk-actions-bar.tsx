import { BulkActionsBar, type BulkAction } from "@/components/bulk-actions-bar";
import { type Row } from "@tanstack/react-table";
import { CircleCheck, FilePlus, Merge } from "lucide-react";
import { BidderItemsDto } from "../../../../../../../convex/lib/types";

interface BillingsBulkActionsBarProps {
  selectedBidders: { bidder: string }[];
  onMergeBills: (items: { bidder: string }[]) => void;
  onMarkPaymentsReceived: (items: { bidder: string }[]) => void;
  onCreateInvoices: (items: { bidder: string }[]) => void;
}

export const BillingsBulkActionsBar = ({
  selectedBidders,
  onMergeBills,
  onMarkPaymentsReceived,
  onCreateInvoices,
}: BillingsBulkActionsBarProps) => {
  const actions: BulkAction<BidderItemsDto>[] = [
    {
      label: "Merge bills",
      icon: Merge,
      onClick: () => onMergeBills(selectedBidders),
      variant: "ghost",
    },
    {
      label: "Payments received",
      icon: CircleCheck,
      onClick: () => onMarkPaymentsReceived(selectedBidders),
      variant: "ghost",
    },
    {
      label: "Create invoices",
      icon: FilePlus,
      onClick: () => onCreateInvoices(selectedBidders),
      variant: "ghost",
    },
  ];

  // Convert bidders to Row<BillingItemDto>
  const selectedRows = selectedBidders.map((bidder) => ({
    id: bidder.bidder,
    original: bidder,
  })) as unknown as Row<BidderItemsDto>[];

  return <BulkActionsBar selectedRows={selectedRows} actions={actions} />;
};
