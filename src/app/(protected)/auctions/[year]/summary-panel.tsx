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
import { SummaryItem } from "./summary-item";

export function SummaryPanel() {
  const params = useParams<{ year: string }>();
  const stats = useQuery(api.auctions.getAuctionsSummary, {
    year: Number(params.year),
  });

  const summaryItems = [
    {
      icon: Package,
      title: "Sold items",
      value: stats?.soldItems ?? 0,
    },
    {
      icon: OctagonMinus,
      title: "Unsold items",
      value: stats?.unsoldItems ?? 0,
    },
    {
      icon: Gavel,
      title: "Sales",
      value: stats?.sales ?? 0,
      isCurrency: true,
    },
    {
      icon: MicVocal,
      title: "Auction fee (20%)",
      value: stats?.auctionFees ?? 0,
      isCurrency: true,
    },
    {
      icon: Handshake,
      title: "Commissions",
      value: stats?.commissions ?? 0,
      isCurrency: true,
    },
    {
      icon: Landmark,
      title: "Net receipts",
      value: stats?.netReceipts ?? 0,
      isCurrency: true,
    },
  ];

  return (
    <div className="bg-muted rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {summaryItems.map((item) => (
          <SummaryItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
            isCurrency={item.isCurrency}
          />
        ))}
      </div>
    </div>
  );
}
