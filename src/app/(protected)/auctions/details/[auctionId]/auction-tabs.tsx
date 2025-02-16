"use client";

import { Badge } from "@/components/ui/badge";
import {
  BILLINGS_SEGMENT,
  LOTS_SEGMENT,
  PROGRESS_SEGMENT,
  Routes,
} from "@/lib/routes";
import { useParams, usePathname, useRouter } from "next/navigation";

const TABS = [
  {
    key: "progress",
    label: "Auction progress",
    route: (auctionId: string) => Routes.auctionDetailsProgress(auctionId),
    pathSegment: PROGRESS_SEGMENT,
  },
  {
    key: "billings",
    label: (
      <div className="flex items-center gap-2">
        Billings
        <Badge variant="destructive" className="rounded-full">
          5
        </Badge>
      </div>
    ),
    route: (auctionId: string) => Routes.auctionDetailsBillings(auctionId),
    pathSegment: BILLINGS_SEGMENT,
  },
  {
    key: "lots",
    label: "Lots",
    route: (auctionId: string) => Routes.auctionDetailsLots(auctionId),
    pathSegment: LOTS_SEGMENT,
  },
] as const;

export function AuctionTabs() {
  const router = useRouter();
  const params = useParams<{ auctionId: string }>();
  const pathname = usePathname();

  return (
    <div className="flex space-x-1 mb-4 gap-x-8 border-b-1">
      {TABS.map((tab) => {
        const isActive = pathname.endsWith(tab.pathSegment);
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.route(params.auctionId))}
            className={`cursor-pointer px-4 py-3 text-md font-medium transition-colors border-b-2 ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
