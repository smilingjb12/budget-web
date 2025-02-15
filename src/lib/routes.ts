export const Routes = {
  auctions() {
    return "/auctions";
  },
  auctionsWithYear(year: number) {
    return `/auctions/${year}`;
  },
  signIn() {
    return "/sign-in";
  },
};
