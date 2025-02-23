import { Badge } from "@/components/ui/badge";

interface LotNumberBadgeProps {
  lotNumber: number;
}

export function LotNumberBadge({ lotNumber }: LotNumberBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="text-muted-foreground rounded-md text-sm font-medium py-0"
    >
      #{lotNumber}
    </Badge>
  );
}
