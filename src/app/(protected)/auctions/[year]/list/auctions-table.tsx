import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEuro, unixToDate } from "@/lib/utils";
import { api } from "../../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { format } from "date-fns";

export function AuctionsTable() {
  const params = useParams<{ year: string }>();
  const auctions =
    useQuery(api.auctions.getAuctions, {
      year: Number(params.year),
    }) ?? [];

  return (
    <>
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
              <TableCell className="text-md">
                {auctions.length - index}
              </TableCell>
              <TableCell className="text-[16px]">
                {format(unixToDate(row.dateTimestamp), "yyyy-MM-dd")}
              </TableCell>
              <TableCell className="text-[16px]">{row.soldItems}</TableCell>
              <TableCell className="text-[16px]">
                {formatEuro(row.sales)}
              </TableCell>
              <TableCell className="text-[16px]">
                {formatEuro(row.auctionFee)}
              </TableCell>
              <TableCell className="text-[16px]">
                - {formatEuro(row.commissions)}
              </TableCell>
              <TableCell className="text-[16px]">
                {formatEuro(row.netReceipts)}
              </TableCell>
              <TableCell className="text-[16px]">
                {format(unixToDate(row.dateTimestamp), "dd/MM/yy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!auctions.length && (
        <div className="flex justify-center mt-3 text-muted-foreground">
          No auctions available
        </div>
      )}
    </>
  );
}
