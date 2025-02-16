import { formatEuro } from "@/lib/utils";

interface SummaryItemProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  isCurrency?: boolean;
}

export function SummaryItem({
  icon: Icon,
  title,
  value,
  isCurrency,
}: SummaryItemProps) {
  return (
    <div className="flex flex-col items-center sm:items-start sm:flex-row">
      <div className="p-2 sm:mr-1">
        <Icon className="size-8 text-foreground" />
      </div>
      <div className="text-center sm:text-left">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-lg font-bold whitespace-nowrap`}>
          {isCurrency ? formatEuro(value as number) : value}
        </p>
      </div>
    </div>
  );
}
