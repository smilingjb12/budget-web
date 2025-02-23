import { LotNumberBadge } from "@/components/lot-number-badge";
import { Constants } from "@/constants";
import { cn, formatEuro } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Id } from "../../../../../../../convex/_generated/dataModel";

export interface BillingItem {
  id: Id<"items">;
  itemId: Id<"items">;
  description: string;
  lotNumber: number;
  hammerPriceInEuros: number;
  auctionFeeInEuros: number;
  amountInEuros: number;
}

export const billingsColumns: ColumnDef<BillingItem, BillingItem>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div className={cn(Constants.TABLE_TEXT_SIZE)}>{row.index + 1}</div>
    ),
    size: 48,
    minSize: 48,
    maxSize: 48,
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => (
      <div className={Constants.TABLE_TEXT_SIZE}>
        {row.original.description}
      </div>
    ),
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "lotNumber",
    header: "LOT No.",
    cell: ({ row }) => (
      <div className={Constants.TABLE_TEXT_SIZE}>
        <LotNumberBadge lotNumber={row.original.lotNumber} />
      </div>
    ),
    size: 160,
    minSize: 160,
  },
  {
    accessorKey: "hammerPriceInEuros",
    header: "HAMMER PRICE",
    cell: ({ row }) => (
      <div className={cn(Constants.TABLE_TEXT_SIZE)}>
        {formatEuro(row.original.hammerPriceInEuros)}
      </div>
    ),
    size: 180,
    minSize: 180,
    maxSize: 180,
  },
  {
    accessorKey: "auctionFeeInEuros",
    header: "AUCTION FEE (20%)",
    cell: ({ row }) => (
      <div className={cn(Constants.TABLE_TEXT_SIZE)}>
        {formatEuro(row.original.auctionFeeInEuros)}
      </div>
    ),
    size: 180,
    minSize: 180,
    maxSize: 180,
  },
  {
    accessorKey: "amountInEuros",
    header: "AMOUNT",
    cell: ({ row }) => (
      <div className={cn(Constants.TABLE_TEXT_SIZE)}>
        {formatEuro(row.original.amountInEuros)}
      </div>
    ),
    size: 10,
  },
];
