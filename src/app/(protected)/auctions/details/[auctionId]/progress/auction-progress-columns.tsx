import { InlineEditInput } from "@/components/inline-edit-input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { type DataTableMeta } from "@/components/ui/data-table";
import { formatEuro, unixToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ItemDto } from "../../../../../../../convex/lib/types";

export type EditableField = Pick<
  ItemDto,
  "description" | "lotNo" | "hammerPriceInEuros" | "billedOn"
>;

export type EditableFieldKeys = keyof EditableField;

export type TableMeta = DataTableMeta<ItemDto, EditableFieldKeys, Id<"items">>;

export const columns: ColumnDef<ItemDto, ItemDto[keyof ItemDto]>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
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
    header: "LOT No.",
    cell: ({ row, table }) => {
      const item = row.original;
      const updateItem = (table.options.meta as TableMeta)?.updateItem;
      return (
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
          onSave={(value) => updateItem?.(item.id, "lotNo", value)}
        />
      );
    },
  },
  {
    accessorKey: "hammerPriceInEuros",
    header: "HAMMER PRICE",
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
    header: "BILLED ON",
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
];
