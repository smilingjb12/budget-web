"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TABLE_TEXT_SIZE } from "@/lib/constants";
import { cn, formatEuro } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

export default function AuctionProgressPage() {
  const params = useParams<{ auctionId: string }>();
  const HIGHLIGHT_DURATION_MS = 4000;
  const items =
    useQuery(api.items.getItems, {
      auctionId: params.auctionId as Id<"auctions">,
    }) ?? [];
  const [selectedItemIds, setSelectedItemIds] = useState<Set<Id<"items">>>(
    new Set()
  );
  const [newItemIds, setNewItemIds] = useState<Set<Id<"items">>>(new Set());
  const prevItemsRef = useRef<typeof items>([]);
  const initialItemsLengthRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip if items is empty (initial load or error state)
    if (items.length === 0) {
      return;
    }

    // Set initial items length if not set
    if (initialItemsLengthRef.current === null) {
      initialItemsLengthRef.current = items.length;
      prevItemsRef.current = items;
      return;
    }

    const newIds = items
      .filter(
        (item) => !prevItemsRef.current.find((prev) => prev._id === item._id)
      )
      .map((item) => item._id);

    if (newIds.length > 0) {
      setNewItemIds(new Set(newIds));
      setTimeout(() => {
        setNewItemIds(new Set());
      }, HIGHLIGHT_DURATION_MS);
    }

    prevItemsRef.current = items;
  }, [items]);

  const toggleAll = (checked: boolean) => {
    if (checked && items) {
      setSelectedItemIds(new Set(items.map((item) => item._id)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  const toggleItem = (itemId: Id<"items">) => {
    const newSelected = new Set(selectedItemIds);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItemIds(newSelected);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes highlightRow {
          0%,
          25% {
            background-color: #e0fedb;
          }
          100% {
            background-color: transparent;
          }
        }
        .highlight-new-row {
          animation: highlightRow 4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <div className="py-4">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedItemIds.size === items.length && items.length > 0
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>LOT No.</TableHead>
              <TableHead>HAMMER PRICE</TableHead>
              <TableHead>INITIAL PRICE</TableHead>
              <TableHead>BILLED ON</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item._id}
                className={cn(newItemIds.has(item._id) && "highlight-new-row")}
              >
                <TableCell className={TABLE_TEXT_SIZE}>{index + 1}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedItemIds.has(item._id)}
                    onCheckedChange={() => toggleItem(item._id)}
                  />
                </TableCell>
                <TableCell className={TABLE_TEXT_SIZE}>
                  {item.description}
                </TableCell>
                <TableCell className={TABLE_TEXT_SIZE}>{item.lotNo}</TableCell>
                <TableCell className={TABLE_TEXT_SIZE}>
                  {item.hammerPrice > 0 ? formatEuro(item.hammerPrice) : ""}
                </TableCell>
                <TableCell className={TABLE_TEXT_SIZE}>
                  {formatEuro(item.initialPrice)}
                </TableCell>
                <TableCell className={TABLE_TEXT_SIZE}>
                  {item.billedOn}
                </TableCell>
                <TableCell
                  className={cn(TABLE_TEXT_SIZE, "text-muted-foreground")}
                >
                  {item.status && (
                    <Badge
                      className="text-muted-foreground rounded-md text-sm font-medium"
                      variant="outline"
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
