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
    cell: ({ row, table }) => {
      const sortedByDate = [...table.getRowModel().rows].sort((a, b) =>
        sortByTimestampDesc(a.original, b.original)
      );
      return sortedByDate.findIndex((r) => r.id === row.id) + 1;
    },
  },
  {
    accessorKey: "dateTimestamp",
    header: "AUCTION",
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
  },
  {
    accessorKey: "salesInEuros",
    header: "SALES",
    cell: ({ row }) => formatEuro(row.original.salesInEuros),
  },
  {
    accessorKey: "auctionFeesInEuros",
    header: "AUCTION FEE",
    cell: ({ row }) => formatEuro(row.original.auctionFeesInEuros),
  },
  {
    accessorKey: "commissionsInEuros",
    header: "COMMISSIONS",
    cell: ({ row }) => formatEuro(row.original.commissionsInEuros),
  },
  {
    accessorKey: "netReceiptsInEuros",
    header: "NET RECEIPTS",
    cell: ({ row }) => formatEuro(row.original.netReceiptsInEuros),
  },
  {
    accessorKey: "dateTimestamp2",
    header: "DATE",
    cell: ({ row }) =>
      format(unixToDate(row.original.dateTimestamp), "dd/MM/yy"),
    sortingFn: (rowA, rowB) => sortByTimestamp(rowA.original, rowB.original),
  },
];
