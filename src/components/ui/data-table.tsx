"use client";

import {
  ColumnDef,
  Row,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { GenericId } from "convex/values";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export interface DataTableMeta<
  TData extends { id: GenericId<string> },
  TEditableFields extends keyof TData = never,
  TId = TData["id"],
> {
  getRowClassName?: (row: TData) => string;
  updateItem?: (id: TId, field: TEditableFields, value: string) => void;
  onRowClick?: (row: TData) => void;
}

export interface DataTableProps<
  TData extends { id: GenericId<string> },
  TEditableFields extends keyof TData = never,
  TId = TData["id"],
> {
  columns: ColumnDef<TData, TData[keyof TData]>[];
  data: TData[];
  className?: string;
  isLoading: boolean;
  initialSorting: SortingState;
  meta?: DataTableMeta<TData, TEditableFields, TId>;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (rows: Row<TData>[]) => void;
}

export function DataTable<
  TData extends { id: GenericId<string> },
  TEditableFields extends keyof TData = never,
  TId = TData["id"],
>({
  columns,
  data,
  className,
  isLoading = false,
  initialSorting = [],
  meta,
  enableRowSelection = false,
  onRowSelectionChange,
}: DataTableProps<TData, TEditableFields, TId>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable<TData>({
    data,
    columns,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    meta,
  });

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getRowModel()
        .rows.filter((row) => rowSelection[row.id]);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  return (
    <div className={cn("rounded-md border-t", className)}>
      <Table>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} noHover={true}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    header.column.getCanSort() && "cursor-pointer select-none"
                  )}
                  onClick={
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                  style={{
                    width: header.column.columnDef.size,
                    minWidth: header.column.columnDef.minSize,
                    maxWidth: header.column.columnDef.maxSize,
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="ml-2">
                          {header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow noHover={true}>
              <TableCell colSpan={columns.length} className="h-24">
                {/* emptiness instead of loading indicator */}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={(
                  table.options.meta as DataTableMeta<
                    TData,
                    TEditableFields,
                    TId
                  >
                )?.getRowClassName?.(row.original)}
                noHover={true}
                onClick={() => {
                  (
                    table.options.meta as DataTableMeta<
                      TData,
                      TEditableFields,
                      TId
                    >
                  )?.onRowClick?.(row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-base"
                    style={{
                      width: cell.column.columnDef.size,
                      minWidth: cell.column.columnDef.minSize,
                      maxWidth: cell.column.columnDef.maxSize,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow noHover={true}>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-lg text-muted-foreground"
              >
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
