import { type Id } from "../_generated/dataModel";

export type AuctionDto = {
  id: Id<"auctions">;
  year: number;
  dateTimestamp: number;
  soldItems: number;
  salesInEuros: number;
  unsoldItems: number;
  auctionFeesInEuros: number;
  commissionsInEuros: number;
  netReceiptsInEuros: number;
};

export type AuctionSummaryDto = {
  year: number;
  soldItems: number;
  unsoldItems: number;
  salesInEuros: number;
  auctionFeesInEuros: number;
  commissionsInEuros: number;
  netReceiptsInEuros: number;
};

export type ItemDto = {
  id: Id<"items">;
  auctionId: Id<"auctions">;
  description: string;
  lotNo: number;
  hammerPriceInEuros: number;
  billedOn: string | undefined;
  initialPriceInEuros: number;
  status: string | undefined;
  creationTimestamp: number;
};
