"use client";

import { DataTable } from "@/components/ui/data-table";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { type Row } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ItemDto } from "../../../../../../../convex/lib/types";
import { AuctionProgressBulkActionsBar } from "./auction-progress-bulk-actions-bar";
import type {
  EditableField,
  EditableFieldKeys,
  TableMeta,
} from "./auction-progress-columns";
import { columns } from "./auction-progress-columns";
import { useAuctionProgressActions } from "./hooks/use-auction-progress-actions";
import { useHighlightNewItems } from "./hooks/use-highlight-new-items";

export default function AuctionProgressPage() {
  const updateItem = useMutation(api.items.updateItem);
  const params = useParams<{ auctionId: string }>();
  const { handleError } = useMutationErrorHandler();
  const [selectedRows, setSelectedRows] = useState<Row<ItemDto>[]>([]);
  const { handleWithhold, handleDelete } = useAuctionProgressActions();
  const items =
    useQuery(api.items.getItems, {
      auctionId: params.auctionId as Id<"auctions">,
    }) ?? [];
  const { newItemIds } = useHighlightNewItems(items);

  const handleFieldUpdate = (
    itemId: Id<"items">,
    field: keyof EditableField,
    value: string
  ) => {
    let parsedValue: EditableField[typeof field];
    switch (field) {
      case "hammerPriceInEuros":
        parsedValue = value ? parseFloat(value.replace(/[,]/g, "")) : 0;
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

  const handleAddNote = (row: Row<ItemDto>) => {
    // TODO: Implement note dialog
    toast({
      title: `Adding note for ${row.original.id}`,
      variant: "default",
    });
  };

  const handleBulkWithhold = (rows: Row<ItemDto>[]) => {
    handleWithhold(rows)
      .then(() => {
        setSelectedRows([]);
      })
      .catch(handleError);
  };

  const handleBulkDelete = (rows: Row<ItemDto>[]) => {
    handleDelete(rows)
      .then(() => {
        setSelectedRows([]);
      })
      .catch(handleError);
  };

  const handleSingleWithhold = (row: Row<ItemDto>) => {
    handleWithhold([row]).catch(handleError);
  };

  const handleSingleDelete = (row: Row<ItemDto>) => {
    handleDelete([row]).catch(handleError);
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
        .highlight-new-row input {
          background-color: transparent !important;
        }
      `}</style>
      <div className="pb-24">
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
          enableRowSelection
          onRowSelectionChange={setSelectedRows}
          meta={
            {
              updateItem: handleFieldUpdate,
              getRowClassName: (row: ItemDto) =>
                newItemIds.has(row.id) ? "highlight-new-row" : "",
              onWithhold: handleSingleWithhold,
              onAddNote: handleAddNote,
              onDelete: handleSingleDelete,
            } as TableMeta
          }
        />
        <AuctionProgressBulkActionsBar
          selectedRows={selectedRows}
          onWithhold={handleBulkWithhold}
          onDelete={handleBulkDelete}
        />
      </div>
    </>
  );
}
