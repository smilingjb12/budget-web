"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SquarePlus } from "lucide-react";

export function CreateAuctionForm() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <SquarePlus className="size-5 mr-2" />
          Create auction
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Auction</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for your new auction.
            </p>
          </div>
          {/* Form fields will go here */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
