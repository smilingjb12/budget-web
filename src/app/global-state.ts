import { atom } from "jotai";
import { AuctionDto } from "../../convex/lib/types";

export const auctionDeleteDialogAtom = atom<{
  auction: AuctionDto | null;
  visible: boolean;
}>({ auction: null, visible: false });

export const auctionDetailsPopoverAtom = atom<{
  auction: AuctionDto | null;
  visible: boolean;
}>({ auction: null, visible: false });
