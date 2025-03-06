// import { auctions } from "@/db/schema/schema";

// import { db } from "@/db";
// import { sql } from "drizzle-orm";

// export type AuctionDto = {
//   id: number;
//   year: number;
//   dateTimestamp: number;
//   soldItems: number;
//   salesInEuros: number;
//   unsoldItems: number;
//   auctionFeesInEuros: number;
//   commissionsInEuros: number;
//   netReceiptsInEuros: number;
// };

// export type CreateAuctionRequest = {
//   date: string;
// };

// export const AuctionService = {
//   async getAuctionsByYear(year: number) {
//     const auctionRows = await db
//       .select()
//       .from(auctions)
//       .where(sql`EXTRACT(YEAR FROM ${auctions.auctionDate}) = ${year}`);

//     const dtos: AuctionDto[] = auctionRows.map((item) => ({
//       id: item.id,
//       year: item.auctionDate.getFullYear(),
//       dateTimestamp: item.auctionDate.getTime(),
//       soldItems: item.soldItems,
//       salesInEuros: parseFloat(item.salesInEuros),
//       unsoldItems: item.unsoldItems,
//       auctionFeesInEuros: parseFloat(item.auctionFeeInEuros),
//       commissionsInEuros: parseFloat(item.commissionsInEuros),
//       netReceiptsInEuros: parseFloat(item.netReceiptsInEuros),
//     }));

//     return dtos;
//   },

//   async createAuction(request: CreateAuctionRequest) {
//     const date = new Date(request.date);
//     const InsertType = auctions.$inferInsert;
//     const row: typeof InsertType = {
//       creationDate: new Date(),
//       auctionDate: date,
//       status: "active",
//       soldItems: 0,
//       salesInEuros: "0",
//       unsoldItems: 0,
//       auctionFeeInEuros: "0",
//       commissionsInEuros: "0",
//       netReceiptsInEuros: "0",
//     };
//     return await db.insert(auctions).values(row);
//   },
// };
