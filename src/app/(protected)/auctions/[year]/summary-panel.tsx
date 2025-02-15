import {
  Package,
  OctagonMinus,
  Gavel,
  MicVocal,
  Handshake,
  Landmark,
} from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import LoadingIndicator from "@/components/loading-indicator";
import { formatEuro } from "@/lib/utils";

function SummaryItem({
  icon: Icon,
  title,
  value,
  isCurrency,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  isCurrency?: boolean;
}) {
  return (
    <div className="flex items-start">
      <div className="p-2 mr-1">
        <Icon className="size-8 text-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-lg font-bold`}>
          {isCurrency ? formatEuro(value as number) : value}
        </p>
      </div>
    </div>
  );
}

export function SummaryPanel() {
  const stats = useQuery(api.auctions.getAuctionsSummary, {
    year: new Date().getFullYear(),
  });
  if (stats === undefined) {
    return (
      <div className="bg-muted rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center">
          <LoadingIndicator className="w-20" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-muted rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <SummaryItem
          icon={Package}
          title="Sold items"
          value={stats.soldItems}
        />
        <SummaryItem
          icon={OctagonMinus}
          title="Unsold items"
          value={stats.unsoldItems}
        />
        <SummaryItem
          icon={Gavel}
          title="Sales"
          value={stats.sales}
          isCurrency
        />
        <SummaryItem
          icon={MicVocal}
          title="Auction fee (20%)"
          value={stats.auctionFees}
          isCurrency
        />
        <SummaryItem
          icon={Handshake}
          title="Commissions"
          value={stats.commissions}
          isCurrency
        />
        <SummaryItem
          icon={Landmark}
          title="Net receipts"
          value={stats.netReceipts}
          isCurrency
        />
      </div>
    </div>
  );
}
