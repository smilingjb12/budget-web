export const LIST_SEGMENT = "list";
export const CALENDAR_SEGMENT = "calendar";
export const AUCTIONS_SEGMENT = "auctions";
export const DETAILS_SEGMENT = "details";
export const PROGRESS_SEGMENT = "progress";
export const BILLINGS_SEGMENT = "billings";
export const LOTS_SEGMENT = "lots";

export const Routes = {
  auctionsList(year: number) {
    return `/${AUCTIONS_SEGMENT}/${year}/${LIST_SEGMENT}`;
  },
  auctionDetailsProgress(auctionId: string) {
    return `/${AUCTIONS_SEGMENT}/${DETAILS_SEGMENT}/${auctionId}/${PROGRESS_SEGMENT}`;
  },
  auctionDetailsBillings(auctionId: string) {
    return `/${AUCTIONS_SEGMENT}/${DETAILS_SEGMENT}/${auctionId}/${BILLINGS_SEGMENT}`;
  },
  auctionDetailsLots(auctionId: string) {
    return `/${AUCTIONS_SEGMENT}/${DETAILS_SEGMENT}/${auctionId}/${LOTS_SEGMENT}`;
  },
  auctionsCalendar(year: number) {
    return `/${AUCTIONS_SEGMENT}/${year}/${CALENDAR_SEGMENT}`;
  },
  signIn() {
    return "/sign-in";
  },
};
