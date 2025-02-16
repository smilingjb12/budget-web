import {
  auctionDeleteDialogAtom,
  auctionDetailsPopoverAtom,
} from "@/app/global-state";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Routes } from "@/lib/routes";
import { formatEuro, unixToDate } from "@/lib/utils";
import { format } from "date-fns";
import { useAtom, useSetAtom } from "jotai";
import {
  Gavel,
  Handshake,
  MicVocal,
  OctagonMinus,
  Package,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, memo } from "react";
import { Doc } from "../../../../../../convex/_generated/dataModel";

interface AuctionDetailsPopoverProps {
  auction: Doc<"auctions">;
  children: ReactNode;
}

function AuctionDetailsPopoverContent({
  auction,
}: {
  auction: Doc<"auctions">;
}) {
  const deleteAuction = () => {
    setAuctionDeleteDialog({ visible: true, auction });
  };
  const setAuctionDeleteDialog = useSetAtom(auctionDeleteDialogAtom);
  const items = [
    { icon: Package, label: "Sold items", value: auction.soldItems },
    {
      icon: OctagonMinus,
      label: "Unsold items",
      value: auction.unsoldItems,
    },
    { icon: Gavel, label: "Sales", value: formatEuro(auction.sales) },
    {
      icon: MicVocal,
      label: "Auction fee (20%)",
      value: formatEuro(auction.auctionFee),
    },
    {
      icon: Handshake,
      label: "Commissions",
      value: formatEuro(Math.abs(auction.commissions)),
    },
    {
      icon: Package,
      label: "Net receipts",
      value: formatEuro(auction.netReceipts),
    },
  ];
  return (
    <div className="p-5 py-3 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-md">
          <Link
            href={Routes.auctionDetailsProgress(auction._id)}
            className="hover:text-primary"
          >
            Auction #{format(unixToDate(auction.dateTimestamp), "yyyy-MM-dd")}
          </Link>
        </h3>
        <Button
          onClick={deleteAuction}
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/80 cursor-pointer p-0 hover:bg-primary/0"
        >
          <div className="flex items-center gap-1 pr-4">
            <Trash2 className="size-4 text-destructive" />
            Delete
          </div>
        </Button>
      </div>
      <div className="space-y-0 text-sm divide-y divide-gray-200">
        {items.map(({ icon: Icon, label, value }, index) => (
          <div
            key={label}
            className={`py-2 flex justify-between items-center ${index === 0 ? "border-t border-gray-200" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Icon className="size-4" />
              <span className="text-gray-600">{label}</span>
            </div>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AuctionDetailsPopover = memo(function AuctionDetailsPopover({
  auction,
  children,
}: AuctionDetailsPopoverProps) {
  const [auctionDetailsPopover, setAuctionDetailsPopover] = useAtom(
    auctionDetailsPopoverAtom
  );
  return (
    <>
      <Popover
        open={
          auctionDetailsPopover.visible &&
          auctionDetailsPopover.auction!._id === auction._id
        }
      >
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          side="right"
          align="start"
          onPointerDownOutside={() =>
            setAuctionDetailsPopover({ visible: false, auction: null })
          }
        >
          <AuctionDetailsPopoverContent auction={auction} />
        </PopoverContent>
      </Popover>
    </>
  );
});
