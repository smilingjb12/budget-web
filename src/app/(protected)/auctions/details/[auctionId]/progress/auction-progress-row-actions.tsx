"use client";

import { type Row } from "@tanstack/react-table";
import { MoreVertical, OctagonMinus, StickyNote, Trash2 } from "lucide-react";

import type { ItemDto } from "@/../../convex/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuctionProgressRowActionsProps {
  row: Row<ItemDto>;
  onWithhold: (row: Row<ItemDto>) => void;
  onAddNote: (row: Row<ItemDto>) => void;
  onDelete: (row: Row<ItemDto>) => void;
}

export function AuctionProgressRowActions({
  row,
  onWithhold,
  onAddNote,
  onDelete,
}: AuctionProgressRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onWithhold(row)}>
          <OctagonMinus className="mr-2 h-4 w-4" />
          Withhold
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddNote(row)}>
          <StickyNote className="mr-2 h-4 w-4" />
          Add note
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(row)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
