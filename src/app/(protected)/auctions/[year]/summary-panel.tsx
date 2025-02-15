import { formatEuro } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  Gavel,
  Handshake,
  Landmark,
  MicVocal,
  OctagonMinus,
  Package,
} from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";

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
    <div className="flex flex-col items-center sm:items-start sm:flex-row">
      <div className="p-2 sm:mr-1">
        <Icon className="size-8 text-foreground" />
      </div>
      <div className="text-center sm:text-left">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-lg font-bold`}>
          {isCurrency ? formatEuro(value as number) : value}
        </p>
      </div>
    </div>
  );
}

export function SummaryPanel() {
  const params = useParams<{ year: string }>();
  const stats = useQuery(api.auctions.getAuctionsSummary, {
    year: Number(params.year),
  });

  return (
    <div className="bg-muted rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <SummaryItem
          icon={Package}
          title="Sold items"
          value={stats?.soldItems ?? 0}
        />
        <SummaryItem
          icon={OctagonMinus}
          title="Unsold items"
          value={stats?.unsoldItems ?? 0}
        />
        <SummaryItem
          icon={Gavel}
          title="Sales"
          value={stats?.sales ?? 0}
          isCurrency
        />
        <SummaryItem
          icon={MicVocal}
          title="Auction fee (20%)"
          value={stats?.auctionFees ?? 0}
          isCurrency
        />
        <SummaryItem
          icon={Handshake}
          title="Commissions"
          value={stats?.commissions ?? 0}
          isCurrency
        />
        <SummaryItem
          icon={Landmark}
          title="Net receipts"
          value={stats?.netReceipts ?? 0}
          isCurrency
        />
      </div>
    </div>
  );
}
