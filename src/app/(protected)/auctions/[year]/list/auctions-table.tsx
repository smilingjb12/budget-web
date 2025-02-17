import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TABLE_TEXT_SIZE } from "@/lib/constants";
import { Routes } from "@/lib/routes";
import { formatEuro, unixToDate } from "@/lib/utils";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";

export function AuctionsTable() {
  const params = useParams<{ year: string }>();
  const auctions =
    useQuery(api.auctions.getAuctionsByYear, {
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
            <TableRow key={row.id}>
              <TableCell className={TABLE_TEXT_SIZE}>
                {auctions.length - index}
              </TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>
                <Link
                  href={Routes.auctionDetailsProgress(row.id)}
                  className="hover:text-primary"
                >
                  {format(unixToDate(row.dateTimestamp), "yyyy-MM-dd")}
                </Link>
              </TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>{row.soldItems}</TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>
                {formatEuro(row.salesInEuros)}
              </TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>
                {formatEuro(row.auctionFeesInEuros)}
              </TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>
                {formatEuro(row.commissionsInEuros)}
              </TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>
                {formatEuro(row.netReceiptsInEuros)}
              </TableCell>
              <TableCell className={TABLE_TEXT_SIZE}>
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
