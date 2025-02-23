import { InlineEditInput } from "@/components/inline-edit-input";
import { LotNumberBadge } from "@/components/lot-number-badge";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { type DataTableMeta } from "@/components/ui/data-table";
import { Constants } from "@/constants";
import { formatEuro, unixToDate } from "@/lib/utils";
import { ColumnDef, type Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ItemDto } from "../../../../../../../convex/lib/types";
import { AuctionRowActions } from "./auction-row-actions";

export type EditableField = Pick<
  ItemDto,
  "description" | "lotNo" | "hammerPriceInEuros" | "billedOn"
>;
export type EditableFieldKeys = keyof EditableField;
export type TableMeta = DataTableMeta<
  ItemDto,
  EditableFieldKeys,
  Id<"items">
> & {
  onWithhold?: (row: Row<ItemDto>) => void;
  onAddNote?: (row: Row<ItemDto>) => void;
  onDelete?: (row: Row<ItemDto>) => void;
};

export const columns: ColumnDef<
  ItemDto,
  string | number | Id<"auctions"> | Id<"items"> | undefined
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    size: 40,
  },
  {
    id: "index",
    header: "#",
    cell: ({ row, table }) => {
      const sortedByDate = [...table.getRowModel().rows].sort(
        (a, b) => a.original.creationTimestamp - b.original.creationTimestamp
      );
      return sortedByDate.findIndex((r) => r.id === row.id) + 1;
    },
  },
  {
    accessorKey: "description",
    header: () => (
      <div className={Constants.EDITABLE_CELL_INPUT_PADDING}>DESCRIPTION</div>
    ),
    cell: ({ row, table }) => {
      const item = row.original;
      const updateItem = (table.options.meta as TableMeta)?.updateItem;
      return (
        <InlineEditInput
          value={item.description}
          onSave={(value) => updateItem?.(item.id, "description", value)}
        />
      );
    },
  },
  {
    accessorKey: "lotNo",
    header: () => (
      <div className={Constants.EDITABLE_CELL_INPUT_PADDING}>LOT No.</div>
    ),
    size: 100,
    cell: ({ row, table }) => {
      const item = row.original;
      const updateItem = (table.options.meta as TableMeta)?.updateItem;
      return (
        <InlineEditInput
          value={String(item.lotNo)}
          displayNode={<LotNumberBadge lotNumber={item.lotNo} />}
          className="w-[60px]"
          onSave={(value) => updateItem?.(item.id, "lotNo", value)}
        />
      );
    },
  },
  {
    accessorKey: "hammerPriceInEuros",
    header: () => (
      <div className={Constants.EDITABLE_CELL_INPUT_PADDING}>HAMMER PRICE</div>
    ),
    cell: ({ row, table }) => {
      const item = row.original;
      const updateItem = (table.options.meta as TableMeta)?.updateItem;
      return (
        <InlineEditInput
          value={String(item.hammerPriceInEuros ?? "")}
          displayValue={
            item.hammerPriceInEuros > 0
              ? formatEuro(item.hammerPriceInEuros)
              : ""
          }
          onSave={(value) => updateItem?.(item.id, "hammerPriceInEuros", value)}
        />
      );
    },
  },
  {
    accessorKey: "billedOn",
    header: () => (
      <div className={Constants.EDITABLE_CELL_INPUT_PADDING}>BILLED ON</div>
    ),
    size: 100,
    cell: ({ row, table }) => {
      const item = row.original;
      const updateItem = (table.options.meta as TableMeta)?.updateItem;
      return (
        <InlineEditInput
          value={item.billedOn ?? ""}
          onSave={(value) => updateItem?.(item.id, "billedOn", value)}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const item = row.original;
      return item.status ? (
        <Badge
          className="text-muted-foreground rounded-md text-sm font-medium"
          variant="outline"
        >
          {item.status.toUpperCase()}
        </Badge>
      ) : null;
    },
  },
  {
    accessorKey: "creationTimestamp",
    header: "TIME",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-muted-foreground text-sm">
          {format(unixToDate(item.creationTimestamp), "HH:mm")}
        </span>
      );
    },
  },
  {
    id: "actions",
    size: 30,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta;
      if (!meta?.onWithhold && !meta?.onAddNote && !meta?.onDelete) {
        return null;
      }
      return (
        <AuctionRowActions
          row={row}
          onWithhold={meta.onWithhold!}
          onAddNote={meta.onAddNote!}
          onDelete={meta.onDelete!}
        />
      );
    },
  },
];
