import { Routes } from "@/lib/routes";
import { formatEuro, unixToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { AuctionDto } from "../../../../../../convex/lib/types";

const sortByTimestamp = (a: AuctionDto, b: AuctionDto) =>
  a.dateTimestamp - b.dateTimestamp;

const sortByTimestampDesc = (a: AuctionDto, b: AuctionDto) =>
  b.dateTimestamp - a.dateTimestamp;

export const columns: ColumnDef<AuctionDto, AuctionDto[keyof AuctionDto]>[] = [
  {
    id: "index",
    header: "#",
    size: 60,
    minSize: 40,
    maxSize: 80,
    cell: ({ row, table }) => {
      const sortedByDate = [...table.getRowModel().rows].sort((a, b) =>
        sortByTimestamp(a.original, b.original)
      );
      return sortedByDate.findIndex((r) => r.id === row.id) + 1;
    },
  },
  {
    accessorKey: "dateTimestamp",
    header: "AUCTION",
    size: 100,
    cell: ({ row }) => {
      const auction = row.original;
      return (
        <Link
          href={Routes.auctionDetailsProgress(auction.id)}
          className="hover:text-primary"
        >
          {format(unixToDate(auction.dateTimestamp), "yyyy-MM-dd")}
        </Link>
      );
    },
    sortingFn: (rowA, rowB) => sortByTimestamp(rowA.original, rowB.original),
  },
  {
    accessorKey: "soldItems",
    header: "SOLD ITEMS",
    size: 100,
    minSize: 80,
  },
  {
    accessorKey: "salesInEuros",
    header: "SALES",
    size: 120,
    minSize: 100,
    cell: ({ row }) => formatEuro(row.original.salesInEuros),
  },
  {
    accessorKey: "auctionFeesInEuros",
    header: "AUCTION FEE",
    size: 120,
    minSize: 100,
    cell: ({ row }) => formatEuro(row.original.auctionFeesInEuros),
  },
  {
    accessorKey: "commissionsInEuros",
    header: "COMMISSIONS",
    size: 120,
    minSize: 100,
    cell: ({ row }) => formatEuro(row.original.commissionsInEuros),
  },
  {
    accessorKey: "netReceiptsInEuros",
    header: "NET RECEIPTS",
    size: 120,
    minSize: 100,
    cell: ({ row }) => formatEuro(row.original.netReceiptsInEuros),
  },
  {
    accessorKey: "dateTimestamp2",
    header: "DATE",
    size: 100,
    minSize: 80,
    cell: ({ row }) =>
      format(unixToDate(row.original.dateTimestamp), "dd/MM/yy"),
    sortingFn: (rowA, rowB) => sortByTimestamp(rowA.original, rowB.original),
  },
];
