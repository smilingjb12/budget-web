"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Constants } from "@/constants";
import { formatEuro } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

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

  return (
    <div className="space-y-2">
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

        return (
          <div key={bidderItem.bidder} className="rounded-lg border">
            <div className="flex flex-col">
              <div
                className="flex items-center p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleExpand(bidderItem.bidder)}
              >
                <div className="flex items-center space-x-4 w-[400px]">
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
                <div className="flex-1 flex justify-end pr-4">
                  <div className="w-[180px] text-right">
                    {formatEuro(totalHammerPrice)}
                  </div>
                  <div className="w-[180px] text-right">
                    {formatEuro(totalAuctionFee)}
                  </div>
                  <div className="w-[180px] text-right">
                    {formatEuro(totalAmount)}
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Lot Number</TableHead>
                        <TableHead className="text-right w-[180px]">
                          Hammer Price
                        </TableHead>
                        <TableHead className="text-right w-[180px]">
                          Auction Fee
                        </TableHead>
                        <TableHead className="text-right w-[180px]">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bidderItem.items.map((item, index) => (
                        <TableRow key={item.itemId}>
                          <TableCell className={Constants.TABLE_TEXT_SIZE}>
                            {index + 1}
                          </TableCell>
                          <TableCell className={Constants.TABLE_TEXT_SIZE}>
                            {item.description}
                          </TableCell>
                          <TableCell className={Constants.TABLE_TEXT_SIZE}>
                            {item.lotNumber}
                          </TableCell>
                          <TableCell
                            className={`${Constants.TABLE_TEXT_SIZE} text-right`}
                          >
                            {formatEuro(item.hammerPriceInEuros)}
                          </TableCell>
                          <TableCell
                            className={`${Constants.TABLE_TEXT_SIZE} text-right`}
                          >
                            {formatEuro(item.auctionFeeInEuros)}
                          </TableCell>
                          <TableCell
                            className={`${Constants.TABLE_TEXT_SIZE} text-right`}
                          >
                            {formatEuro(item.amountInEuros)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
