"use client";

import {
  ColumnDef,
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
}: DataTableProps<TData, TEditableFields, TId>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable<TData>({
    data,
    columns,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta,
  });

  return (
    <div className={cn("rounded-md border-t", className)}>
      <Table>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
            <TableRow>
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
                noHover
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-base">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
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
