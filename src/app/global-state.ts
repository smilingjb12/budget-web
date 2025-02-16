import { atom } from "jotai";
import { Doc } from "../../convex/_generated/dataModel";

export const auctionDeleteDialogAtom = atom<{
  auction: Doc<"auctions"> | null;
  visible: boolean;
}>({ auction: null, visible: false });

export const auctionDetailsPopoverAtom = atom<{
  auction: Doc<"auctions"> | null;
  visible: boolean;
}>({ auction: null, visible: false });
