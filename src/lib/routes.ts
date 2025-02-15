export const Routes = {
  auctions() {
    return "/auctions";
  },
  auctionsList(year: number) {
    return `/auctions/${year}/list`;
  },
  auctionsCalendar(year: number) {
    return `/auctions/${year}/calendar`;
  },
  signIn() {
    return "/sign-in";
  },
};
