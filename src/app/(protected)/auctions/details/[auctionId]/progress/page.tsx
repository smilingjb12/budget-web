"use client";

import { InlineEditInput } from "@/components/inline-edit-input";
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
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { TABLE_TEXT_SIZE } from "@/lib/constants";
import { cn, formatEuro } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { format, fromUnixTime } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ItemDto } from "../../../../../../../convex/lib/types";
import { useHighlightNewItems } from "./hooks/use-highlight-new-items";

type EditableField = Pick<
  ItemDto,
  "description" | "lotNo" | "hammerPriceInEuros" | "billedOn"
>;

export default function AuctionProgressPage() {
  const updateItem = useMutation(api.items.updateItem);
  const params = useParams<{ auctionId: string }>();
  const { handleError } = useMutationErrorHandler();
  const HIGHLIGHT_DURATION_MS = 4000;
  const CELL_PADDING = "py-2 px-4";
  const items =
    useQuery(api.items.getItems, {
      auctionId: params.auctionId as Id<"auctions">,
    }) ?? [];
  const [selectedItemIds, setSelectedItemIds] = useState<Set<Id<"items">>>(
    new Set()
  );
  const { newItemIds } = useHighlightNewItems(items, HIGHLIGHT_DURATION_MS);

  const toggleAll = (checked: boolean) => {
    if (checked && items) {
      setSelectedItemIds(new Set(items.map((item) => item.id)));
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

  const handleFieldUpdate = (
    itemId: Id<"items">,
    field: keyof EditableField,
    value: string
  ) => {
    let parsedValue: EditableField[typeof field];
    switch (field) {
      case "hammerPriceInEuros":
        parsedValue = value
          ? parseFloat(
              value.replace(/[,]/g, "") // Remove dots (thousand separators)
            )
          : 0;
        break;
      case "lotNo":
        parsedValue = value ? parseInt(value) : 0;
        break;
      case "billedOn":
        parsedValue = value ?? "";
        break;
      default:
        parsedValue = value;
    }

    console.log("parsedValue:", parsedValue);

    updateItem({ itemId, updates: { [field]: parsedValue } })
      .then(() => {
        toast({
          title: "Item updated",
          variant: "default",
        });
      })
      .catch(handleError)
      .finally(() => {});
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
          animation: highlightRow 3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .highlight-new-row input {
          background-color: transparent !important;
        }
      `}</style>
      <div className="py-4">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className={cn("w-10", CELL_PADDING)}>#</TableHead>
              <TableHead className={cn(CELL_PADDING, "w-10")}>
                <Checkbox
                  checked={
                    selectedItemIds.size === items.length && items.length > 0
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className={cn("w-[30%]", CELL_PADDING)}>
                DESCRIPTION
              </TableHead>
              <TableHead className={cn(CELL_PADDING, "w-30")}>
                LOT No.
              </TableHead>
              <TableHead className={CELL_PADDING}>HAMMER PRICE</TableHead>
              <TableHead className={CELL_PADDING}>BILLED ON</TableHead>
              <TableHead className={CELL_PADDING}></TableHead>
              <TableHead className={cn(CELL_PADDING, "w-20")}>TIME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id}
                className={cn(
                  "hover:bg-transparent",
                  newItemIds.has(item.id) && "highlight-new-row"
                )}
              >
                <TableCell className={cn(TABLE_TEXT_SIZE, CELL_PADDING)}>
                  {items.length - index}
                </TableCell>
                <TableCell className={CELL_PADDING}>
                  <Checkbox
                    checked={selectedItemIds.has(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                </TableCell>
                <TableCell
                  className={cn(TABLE_TEXT_SIZE, CELL_PADDING, "pl-2")}
                >
                  <InlineEditInput
                    value={item.description}
                    onSave={(value) =>
                      handleFieldUpdate(item.id, "description", value)
                    }
                  />
                </TableCell>
                <TableCell
                  className={cn(TABLE_TEXT_SIZE, CELL_PADDING, "pl-2")}
                >
                  <InlineEditInput
                    value={String(item.lotNo)}
                    displayNode={
                      <Badge
                        variant="outline"
                        className="text-muted-foreground rounded-md text-sm font-medium"
                      >
                        #{item.lotNo}
                      </Badge>
                    }
                    onSave={(value) =>
                      handleFieldUpdate(item.id, "lotNo", value)
                    }
                  />
                </TableCell>
                <TableCell
                  className={cn(TABLE_TEXT_SIZE, CELL_PADDING, "pl-2")}
                >
                  <InlineEditInput
                    value={String(item.hammerPriceInEuros ?? "")}
                    displayValue={
                      item.hammerPriceInEuros > 0
                        ? formatEuro(item.hammerPriceInEuros)
                        : ""
                    }
                    onSave={(value) =>
                      handleFieldUpdate(item.id, "hammerPriceInEuros", value)
                    }
                  />
                </TableCell>
                <TableCell
                  className={cn(TABLE_TEXT_SIZE, CELL_PADDING, "pl-2")}
                >
                  <InlineEditInput
                    value={item.billedOn ?? ""}
                    onSave={(value) =>
                      handleFieldUpdate(item.id, "billedOn", value)
                    }
                  />
                </TableCell>
                <TableCell
                  className={cn(
                    TABLE_TEXT_SIZE,
                    "text-muted-foreground",
                    CELL_PADDING
                  )}
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
                <TableCell
                  className={cn(
                    TABLE_TEXT_SIZE,
                    "text-muted-foreground text-sm",
                    CELL_PADDING
                  )}
                >
                  {format(fromUnixTime(item.creationTimestamp), "HH:mm")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
