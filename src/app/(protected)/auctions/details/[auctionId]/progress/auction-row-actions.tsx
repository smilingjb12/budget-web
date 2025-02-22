"use client";

import { type Row } from "@tanstack/react-table";
import {
  MessageSquareText,
  MoreVertical,
  OctagonMinus,
  Trash2,
} from "lucide-react";

import type { ItemDto } from "@/../../convex/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuctionRowActionsProps {
  row: Row<ItemDto>;
  onWithhold: (row: Row<ItemDto>) => void;
  onAddNote: (row: Row<ItemDto>) => void;
  onDelete: (row: Row<ItemDto>) => void;
}

export function AuctionRowActions({
  row,
  onWithhold,
  onAddNote,
  onDelete,
}: AuctionRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px] py-3 px-2">
        <DropdownMenuItem
          onClick={() => onWithhold(row)}
          className="text-muted-foreground px-2 py-3 cursor-pointer"
        >
          <OctagonMinus className="mr-3 size-5" />
          Withhold
        </DropdownMenuItem>
        <div className="h-px my-1 bg-muted" />
        <DropdownMenuItem
          onClick={() => onAddNote(row)}
          className="text-muted-foreground px-2 py-3 cursor-pointer"
        >
          <MessageSquareText className="mr-3 size-5" />
          Add note
        </DropdownMenuItem>
        <div className="h-px my-1 bg-muted" />
        <DropdownMenuItem
          onClick={() => onDelete(row)}
          className="text-destructive focus:text-destructive px-2 py-3 cursor-pointer"
        >
          <Trash2 className="mr-3 size-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
