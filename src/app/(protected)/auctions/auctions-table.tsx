import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AuctionsTable() {
  return (
    <Table className="mt-6">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>AUCTION</TableHead>
          <TableHead>SOLD ITEMS</TableHead>
          <TableHead>SALES</TableHead>
          <TableHead>AUCTION FEE</TableHead>
          <TableHead>COMMISSIONS</TableHead>
          <TableHead>NET RECEIPTS</TableHead>
          <TableHead>DATE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          {
            id: 5,
            date: "2025-03-11",
            soldItems: 915,
            sales: "29,512.00",
            auctionFee: "5,902.00",
            commissions: "-4,211.50",
            netReceipts: "31,202.90",
            displayDate: "25/03/11",
          },
          {
            id: 4,
            date: "2025-02-18",
            soldItems: 721,
            sales: "39,512.00",
            auctionFee: "29,512.00",
            commissions: "-4,211.50",
            netReceipts: "42,102.20",
            displayDate: "25/02/18",
          },
          {
            id: 3,
            date: "2025-02-11",
            soldItems: 857,
            sales: "27,512.00",
            auctionFee: "29,512.00",
            commissions: "-4,211.50",
            netReceipts: "29,278.50",
            displayDate: "25/02/11",
          },
          {
            id: 2,
            date: "2025-01-28",
            soldItems: 489,
            sales: "29,512.00",
            auctionFee: "29,512.00",
            commissions: "-4,211.50",
            netReceipts: "52,486.80",
            displayDate: "25/01/28",
          },
          {
            id: 1,
            date: "2025-01-14",
            soldItems: 758,
            sales: "29,512.00",
            auctionFee: "29,512.00",
            commissions: "-4,211.50",
            netReceipts: "42,336.20",
            displayDate: "25/01/14",
          },
        ].map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.soldItems}</TableCell>
            <TableCell>€{row.sales}</TableCell>
            <TableCell>€{row.auctionFee}</TableCell>
            <TableCell className="text-red-500">€{row.commissions}</TableCell>
            <TableCell>€{row.netReceipts}</TableCell>
            <TableCell>{row.displayDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
