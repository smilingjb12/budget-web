"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";
import { Routes, CALENDAR_SEGMENT, LIST_SEGMENT } from "@/lib/routes";
import { CalendarDays, List, SquarePlus } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { CreateAuctionDialog } from "./components/create-auction-dialog";
import { SummaryPanel } from "./summary-panel";
import { YearSelector } from "./year-selector";

interface AuctionTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  onClick: () => void;
}

function AuctionTabsTrigger({
  value,
  children,
  onClick,
}: AuctionTabsTriggerProps) {
  return (
    <TabsTrigger
      onClick={onClick}
      value={value}
      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background px-4 data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

export default function AuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [optimisticSegment, setOptimisticSegment] = useState<string | null>(
    null
  );
  const router = useRouter();
  const params = useParams<{ year: string }>();
  const pathname = usePathname();

  const handleTabChange = (route: string, segment: string) => {
    if (window.location.pathname.includes(segment)) {
      return;
    }
    setOptimisticSegment(segment);
    setIsNavigating(true);
    router.push(route);
  };

  React.useEffect(() => {
    setIsNavigating(false);
    setOptimisticSegment(null);
  }, [pathname]);

  const currentSegment =
    optimisticSegment ??
    (pathname.endsWith(CALENDAR_SEGMENT) ? CALENDAR_SEGMENT : LIST_SEGMENT);

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

          <Tabs value={currentSegment} className="mb-1">
            <TabsList className="border rounded-md">
              <AuctionTabsTrigger
                value={LIST_SEGMENT}
                onClick={() =>
                  handleTabChange(
                    Routes.auctionsList(Number(params.year)),
                    LIST_SEGMENT
                  )
                }
              >
                <List className="w-4 h-4 mr-2" />
                List
              </AuctionTabsTrigger>
              <AuctionTabsTrigger
                value={CALENDAR_SEGMENT}
                onClick={() =>
                  handleTabChange(
                    Routes.auctionsCalendar(Number(params.year)),
                    CALENDAR_SEGMENT
                  )
                }
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Calendar
              </AuctionTabsTrigger>
            </TabsList>
          </Tabs>

          {isNavigating ? (
            <div className="mt-8">
              <LoadingIndicator />
            </div>
          ) : (
            children
          )}

          <CreateAuctionDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        </div>
      </div>
    </div>
  );
}
