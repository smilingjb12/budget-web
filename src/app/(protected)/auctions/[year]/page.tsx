"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";
import { CalendarDays, List, SquarePlus } from "lucide-react";
import { useState } from "react";
import { AuctionsCalendar } from "./components/auctions-calendar";
import { AuctionsTable } from "./components/auctions-table";
import { CreateAuctionDialog } from "./components/create-auction-dialog";
import { SummaryPanel } from "./summary-panel";
import { YearSelector } from "./year-selector";

interface AuctionTabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

function AuctionTabsTrigger({ value, children }: AuctionTabsTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background px-4 data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

export default function Auctions() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="flex-1" style={{ paddingLeft: SIDEBAR_WIDTH_PX }}>
        <div className="p-2 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <YearSelector />
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <SquarePlus className="size-5 mr-2" />
              Create auction
            </Button>
          </div>

          <SummaryPanel />

          <Tabs defaultValue="list" className="mb-6">
            <TabsList className="border rounded-md">
              <AuctionTabsTrigger value="list">
                <List className="w-4 h-4 mr-2" />
                List
              </AuctionTabsTrigger>
              <AuctionTabsTrigger value="calendar">
                <CalendarDays className="w-4 h-4 mr-2" />
                Calendar
              </AuctionTabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <AuctionsTable />
            </TabsContent>

            <TabsContent value="calendar">
              <AuctionsCalendar />
            </TabsContent>
          </Tabs>

          <CreateAuctionDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        </div>
      </div>
    </div>
  );
}
