"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { columns } from "./auctions-table-columns";

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
