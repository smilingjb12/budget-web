import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import LoadingIndicator from "@/components/loading-indicator";
import { formatEuro } from "@/lib/utils";

export function AuctionsTable() {
  const auctions = useQuery(api.auctions.getAuctions);
  if (auctions === undefined) {
    return <LoadingIndicator className="w-20" />;
  }
  return (
    <Table className="mt-6">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead className="">AUCTION</TableHead>
          <TableHead>SOLD ITEMS</TableHead>
          <TableHead>SALES</TableHead>
          <TableHead>AUCTION FEE</TableHead>
          <TableHead>COMMISSIONS</TableHead>
          <TableHead>NET RECEIPTS</TableHead>
          <TableHead>DATE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.map((row, index) => (
          <TableRow key={row._id}>
            <TableCell>{auctions.length - index}</TableCell>
            <TableCell>
              {new Date(row.dateTimestamp).toLocaleDateString()}
            </TableCell>
            <TableCell>{row.soldItems}</TableCell>
            <TableCell>{formatEuro(row.sales)}</TableCell>
            <TableCell>{formatEuro(row.auctionFee)}</TableCell>
            <TableCell>- {formatEuro(row.commissions)}</TableCell>
            <TableCell>{formatEuro(row.netReceipts)}</TableCell>
            <TableCell>
              {new Date(row.dateTimestamp).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
