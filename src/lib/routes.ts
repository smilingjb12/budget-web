export const LIST_SEGMENT = "list";
export const CALENDAR_SEGMENT = "calendar";
export const AUCTIONS_SEGMENT = "auctions";

export const Routes = {
  auctionsList(year: number) {
    return `/${AUCTIONS_SEGMENT}/${year}/${LIST_SEGMENT}`;
  },
  auctionsCalendar(year: number) {
    return `/${AUCTIONS_SEGMENT}/${year}/${CALENDAR_SEGMENT}`;
  },
  signIn() {
    return "/sign-in";
  },
};
