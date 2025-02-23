"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/hooks/use-toast";
import { formatEuro } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { BillingsBulkActionsBar } from "./billings-bulk-actions-bar";
import { billingsColumns } from "./billings-columns";

export default function BillingsPage() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [expandedBidders, setExpandedBidders] = useState<Set<string>>(
    new Set()
  );
  const [selectedBidders, setSelectedBidders] = useState<Set<string>>(
    new Set()
  );

  const bidderItems =
    useQuery(api.items.getBidderItems, {
      auctionId: auctionId as Id<"auctions">,
    }) ?? [];

  const toggleExpand = (bidder: string) => {
    const newExpanded = new Set(expandedBidders);
    if (newExpanded.has(bidder)) {
      newExpanded.delete(bidder);
    } else {
      newExpanded.add(bidder);
    }
    setExpandedBidders(newExpanded);
  };

  const toggleSelect = (bidder: string) => {
    const newSelected = new Set(selectedBidders);
    if (newSelected.has(bidder)) {
      newSelected.delete(bidder);
    } else {
      newSelected.add(bidder);
    }
    setSelectedBidders(newSelected);
  };

  const handleMergeBills = (items: { bidder: string }[]) => {
    // TODO: Implement merge bills functionality
    toast({
      title: `Merging ${items.length} bills`,
      variant: "default",
    });
    setSelectedBidders(new Set());
  };

  const handleMarkPaymentsReceived = (items: { bidder: string }[]) => {
    // TODO: Implement mark payments received functionality
    toast({
      title: `Marking ${items.length} payments as received`,
      variant: "default",
    });
    setSelectedBidders(new Set());
  };

  const handleCreateInvoices = (items: { bidder: string }[]) => {
    // TODO: Implement create invoices functionality
    toast({
      title: `Creating invoices for ${items.length} items`,
      variant: "default",
    });
    setSelectedBidders(new Set());
  };

  return (
    <div className="space-y-4 pb-24">
      {bidderItems.map((bidderItem) => {
        const totalHammerPrice = bidderItem.items.reduce(
          (sum, item) => sum + item.hammerPriceInEuros,
          0
        );
        const totalAuctionFee = bidderItem.items.reduce(
          (sum, item) => sum + item.auctionFeeInEuros,
          0
        );
        const totalAmount = bidderItem.items.reduce(
          (sum, item) => sum + item.amountInEuros,
          0
        );
        const isExpanded = expandedBidders.has(bidderItem.bidder);
        const bidderColumnPadding = 30;
        const bidderColumnWidth =
          (billingsColumns[0]?.size ?? 0) +
          (billingsColumns[1]?.size ?? 0) +
          (billingsColumns[2]?.size ?? 0) +
          bidderColumnPadding;

        const bidderColumns = [
          {
            id: "bidder",
            header: billingsColumns[0]?.header,
            size: bidderColumnWidth,
            minSize: bidderColumnWidth,
            cell: () => (
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedBidders.has(bidderItem.bidder)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(bidderItem.bidder);
                  }}
                />
                <span className="font-medium">{bidderItem.bidder}</span>
                <div className="border rounded-md px-2.5 py-1 text-sm">
                  {bidderItem.items.length}
                </div>
              </div>
            ),
          },
          {
            ...billingsColumns[3],
            cell: () => (
              <div className="text-base">{formatEuro(totalHammerPrice)}</div>
            ),
          },
          {
            ...billingsColumns[4],
            cell: () => (
              <div className="text-base">{formatEuro(totalAuctionFee)}</div>
            ),
          },
          {
            ...billingsColumns[5],
            cell: () => (
              <div className="text-base">{formatEuro(totalAmount)}</div>
            ),
          },
        ];

        return (
          <div
            key={bidderItem.bidder}
            className="rounded-lg border first:border-t-0"
          >
            <div className="flex flex-col">
              <DataTable
                columns={bidderColumns}
                data={[
                  {
                    id: bidderItem.items[0].itemId,
                    itemId: bidderItem.items[0].itemId,
                    description: "Totals",
                    lotNumber: bidderItem.items.length,
                    hammerPriceInEuros: totalHammerPrice,
                    auctionFeeInEuros: totalAuctionFee,
                    amountInEuros: totalAmount,
                  },
                ]}
                isLoading={false}
                initialSorting={[]}
                className="border-none [&_thead]:collapse"
                meta={{
                  getRowClassName: () => "cursor-pointer hover:bg-muted/50",
                  onRowClick: () => toggleExpand(bidderItem.bidder),
                }}
              />
              {isExpanded && (
                <>
                  <DataTable
                    columns={billingsColumns}
                    data={bidderItem.items.map((item) => ({
                      id: item.itemId,
                      itemId: item.itemId,
                      description: item.description,
                      lotNumber: item.lotNumber,
                      hammerPriceInEuros: item.hammerPriceInEuros,
                      auctionFeeInEuros: item.auctionFeeInEuros,
                      amountInEuros: item.amountInEuros,
                    }))}
                    isLoading={false}
                    initialSorting={[]}
                  />
                  <div className="bg-muted py-3 px-4 text-muted-foreground uppercase text-[13px]">
                    {bidderItem.items.length} items
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
      <BillingsBulkActionsBar
        selectedBidders={bidderItems
          .filter((bidderItem) => selectedBidders.has(bidderItem.bidder))
          .map((bidderItem) => ({
            bidder: bidderItem.bidder,
            items: bidderItem.items.map((item) => ({
              ...item,
              id: item.itemId,
            })),
          }))}
        onMergeBills={handleMergeBills}
        onMarkPaymentsReceived={handleMarkPaymentsReceived}
        onCreateInvoices={handleCreateInvoices}
      />
    </div>
  );
}
