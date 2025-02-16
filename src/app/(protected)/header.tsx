"use client";

import {
  BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/app/(protected)/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";
import { DETAILS_SEGMENT, Routes } from "@/lib/routes";
import { unixToDate } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function Header() {
  const { signOut } = useAuthActions();
  const params = useParams<{ year: string; auctionId?: string }>();
  const pathname = usePathname();

  const auction = useQuery(
    api.auctions.getAuctionById,
    params.auctionId ? { id: params.auctionId as Id<"auctions"> } : "skip"
  );

  const isDetailsPage = pathname.includes(`/${DETAILS_SEGMENT}`);
  const auctionDate = auction ? unixToDate(auction.dateTimestamp) : null;
  const auctionYear = auctionDate ? format(auctionDate, "yyyy") : params.year;

  return (
    <div
      className="h-12 fixed top-0 right-0 bg-background z-50 flex items-center px-6 pl-10 border-b"
      style={{ left: SIDEBAR_WIDTH_PX }}
    >
      <Breadcrumbs>
        <BreadcrumbItem>Auctions</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem isActive={!isDetailsPage}>
          {isDetailsPage ? (
            <Link
              href={Routes.auctionsList(Number(auctionYear))}
              className="hover:text-primary hover:cursor-pointer"
            >
              {auctionYear}
            </Link>
          ) : (
            auctionYear
          )}
        </BreadcrumbItem>
        {isDetailsPage && auction && auctionDate && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem isActive>
              {format(auctionDate, "EEE, MMMM d")}
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumbs>
      <div className="ml-auto">
        <Button
          variant="ghost"
          className="text-muted-foreground cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4 mr-2 text-primary" />
          Log out
        </Button>
      </div>
    </div>
  );
}
