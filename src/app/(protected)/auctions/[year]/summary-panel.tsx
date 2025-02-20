import {
  Gavel,
  Handshake,
  Landmark,
  MicVocal,
  OctagonMinus,
  Package,
} from "lucide-react";
import { SummaryItem } from "./summary-item";

interface SummaryPanelProps {
  stats:
    | {
        soldItems: number;
        unsoldItems: number;
        salesInEuros: number;
        auctionFeesInEuros: number;
        commissionsInEuros: number;
        netReceiptsInEuros: number;
      }
    | undefined
    | null;
}

export function SummaryPanel({ stats }: SummaryPanelProps) {
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
      value: stats?.salesInEuros ?? 0,
      isCurrency: true,
    },
    {
      icon: MicVocal,
      title: "Auction fee (20%)",
      value: stats?.auctionFeesInEuros ?? 0,
      isCurrency: true,
    },
    {
      icon: Handshake,
      title: "Commissions",
      value: stats?.commissionsInEuros ?? 0,
      isCurrency: true,
    },
    {
      icon: Landmark,
      title: "Net receipts",
      value: stats?.netReceiptsInEuros ?? 0,
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
