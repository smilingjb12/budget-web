export const LIST_SEGMENT = "list";
export const CALENDAR_SEGMENT = "calendar";

export const Routes = {
  auctions() {
    return "/auctions";
  },
  auctionsList(year: number) {
    return `/auctions/${year}/${LIST_SEGMENT}`;
  },
  auctionsCalendar(year: number) {
    return `/auctions/${year}/${CALENDAR_SEGMENT}`;
  },
  signIn() {
    return "/sign-in";
  },
};
