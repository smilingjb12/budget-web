"use client";

import { DataTable } from "@/components/ui/data-table";
import { Routes } from "@/lib/routes";
import { formatEuro, unixToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { AuctionDto } from "../../../../../../convex/lib/types";

const columns: ColumnDef<AuctionDto, AuctionDto[keyof AuctionDto]>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row, table }) => {
      const sortedRows = [...table.getRowModel().rows].sort(
        (a, b) => a.original.dateTimestamp - b.original.dateTimestamp
      );
      const index = sortedRows.findIndex((r) => r.id === row.id);
      return index + 1;
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
    sortingFn: (rowA, rowB) => {
      return rowA.original.dateTimestamp - rowB.original.dateTimestamp;
    },
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
    sortingFn: (rowA, rowB) => {
      return rowA.original.dateTimestamp - rowB.original.dateTimestamp;
    },
  },
];

export function AuctionsTable() {
  const params = useParams<{ year: string }>();
  const auctions = useQuery(api.auctions.getAuctionsByYear, {
    year: Number(params.year),
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={auctions ?? []}
        className="mt-6"
        isLoading={auctions === undefined}
        initialSorting={[
          {
            id: "dateTimestamp",
            desc: true,
          },
        ]}
      />
    </>
  );
}
