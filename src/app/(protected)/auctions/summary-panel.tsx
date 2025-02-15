import {
  Package,
  OctagonMinus,
  Gavel,
  MicVocal,
  Handshake,
  Landmark,
} from "lucide-react";

function SummaryItem({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start">
      <div className="p-2 mr-1">
        <Icon className="size-8 text-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-lg font-bold`}>{value}</p>
      </div>
    </div>
  );
}

export function SummaryPanel() {
  return (
    <div className="bg-muted rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <SummaryItem icon={Package} title="Sold items" value="23,718" />
        <SummaryItem icon={OctagonMinus} title="Unsold items" value="426" />
        <SummaryItem icon={Gavel} title="Sales" value="€708,512.00" />
        <SummaryItem
          icon={MicVocal}
          title="Auction fee (20%)"
          value="€141,702.40"
        />
        <SummaryItem
          icon={Handshake}
          title="Commissions"
          value="-€101,076.00"
        />
        <SummaryItem icon={Landmark} title="Net receipts" value="€465,733.60" />
      </div>
    </div>
  );
}
