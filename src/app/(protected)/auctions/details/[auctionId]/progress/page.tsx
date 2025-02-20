"use client";

import { DataTable } from "@/components/ui/data-table";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ItemDto } from "../../../../../../../convex/lib/types";
import type {
  EditableField,
  EditableFieldKeys,
} from "./auction-progress-columns";
import { columns } from "./auction-progress-columns";
import { useHighlightNewItems } from "./hooks/use-highlight-new-items";

export default function AuctionProgressPage() {
  const updateItem = useMutation(api.items.updateItem);
  const params = useParams<{ auctionId: string }>();
  const { handleError } = useMutationErrorHandler();
  const HIGHLIGHT_DURATION_MS = 4000;
  const items =
    useQuery(api.items.getItems, {
      auctionId: params.auctionId as Id<"auctions">,
    }) ?? [];
  const { newItemIds } = useHighlightNewItems(items, HIGHLIGHT_DURATION_MS);

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

    updateItem({ itemId, updates: { [field]: parsedValue } })
      .then(() => {
        toast({
          title: "Item updated",
          variant: "default",
        });
      })
      .catch(handleError);
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
      <div className="">
        <DataTable<ItemDto, EditableFieldKeys, Id<"items">>
          columns={columns}
          data={items}
          isLoading={!items}
          initialSorting={[
            {
              id: "creationTimestamp",
              desc: true,
            },
          ]}
          className="mt-6 [&_td]:py-2"
          meta={{
            updateItem: handleFieldUpdate,
            getRowClassName: (row: ItemDto) =>
              newItemIds.has(row.id) ? "highlight-new-row" : "",
          }}
        />
      </div>
    </>
  );
}
