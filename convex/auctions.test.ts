import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("should create an auction", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });
  const id = await asAdmin.mutation(api.auctions.createAuction, {
    date: `${year}-01-01`,
  });

  const auction = await asAdmin.run(async (ctx) => {
    return await ctx.db.query("auctions").first();
  });
  expect(auction).toMatchObject({
    _id: id,
    auctionFeeInCents: 0,
    commissionsInCents: 0,
    netReceiptsInCents: 0,
    salesInCents: 0,
    soldItems: 0,
    status: "active",
    unsoldItems: 0,
    year,
  });
});

test("should get auctions by year", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  await asAdmin.run(async (ctx) => {
    await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-01-01`).getTime(),
      status: "active",
      auctionFeeInCents: 0,
      commissionsInCents: 0,
      netReceiptsInCents: 0,
      salesInCents: 0,
      soldItems: 0,
      unsoldItems: 0,
    });
    await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-06-01`).getTime(),
      status: "active",
      auctionFeeInCents: 0,
      commissionsInCents: 0,
      netReceiptsInCents: 0,
      salesInCents: 0,
      soldItems: 0,
      unsoldItems: 0,
    });
  });

  const auctions = await asAdmin.query(api.auctions.getAuctionsByYear, {
    year,
  });

  expect(auctions).toHaveLength(2);
  expect(auctions[0].year).toBe(year);
  expect(auctions[1].year).toBe(year);
});

test("should delete an auction", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  const id = await asAdmin.run(async (ctx) => {
    return await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-01-01`).getTime(),
      status: "active",
      auctionFeeInCents: 0,
      commissionsInCents: 0,
      netReceiptsInCents: 0,
      salesInCents: 0,
      soldItems: 0,
      unsoldItems: 0,
    });
  });

  await asAdmin.mutation(api.auctions.deleteAuction, { id });

  const auction = await asAdmin.run(async (ctx) => {
    return await ctx.db.query("auctions").first();
  });
  expect(auction).toBeNull();
});

test("should get auctions summary by year", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  await asAdmin.run(async (ctx) => {
    await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-01-01`).getTime(),
      status: "active",
      auctionFeeInCents: 10000,
      commissionsInCents: 20000,
      netReceiptsInCents: 30000,
      salesInCents: 40000,
      soldItems: 2,
      unsoldItems: 1,
    });
    await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-06-01`).getTime(),
      status: "active",
      auctionFeeInCents: 50000,
      commissionsInCents: 60000,
      netReceiptsInCents: 70000,
      salesInCents: 80000,
      soldItems: 3,
      unsoldItems: 2,
    });
  });

  const summary = await asAdmin.query(api.auctions.getAuctionsSummary, {
    year,
  });

  expect(summary).toMatchObject({
    year,
    soldItems: 5,
    unsoldItems: 3,
    salesInEuros: 1200,
    commissionsInEuros: 800,
    netReceiptsInEuros: 1000,
    auctionFeesInEuros: 600,
  });
});

test("should get auction summary by id", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  const id = await asAdmin.run(async (ctx) => {
    return await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-01-01`).getTime(),
      status: "active",
      auctionFeeInCents: 10000,
      commissionsInCents: 20000,
      netReceiptsInCents: 30000,
      salesInCents: 40000,
      soldItems: 2,
      unsoldItems: 1,
    });
  });

  const summary = await asAdmin.query(api.auctions.getAuctionSummary, {
    auctionId: id,
  });

  expect(summary).toMatchObject({
    auctionFeesInEuros: 100,
    commissionsInEuros: 200,
    netReceiptsInEuros: 300,
    salesInEuros: 400,
    soldItems: 2,
    unsoldItems: 1,
  });
});

test("should get auction by id", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  const id = await asAdmin.run(async (ctx) => {
    return await ctx.db.insert("auctions", {
      year,
      dateTimestamp: new Date(`${year}-01-01`).getTime(),
      status: "active",
      auctionFeeInCents: 10000,
      commissionsInCents: 20000,
      netReceiptsInCents: 30000,
      salesInCents: 40000,
      soldItems: 2,
      unsoldItems: 1,
    });
  });

  const auction = await asAdmin.query(api.auctions.getAuctionById, {
    id,
  });

  expect(auction).toMatchObject({
    id,
    year,
    dateTimestamp: new Date(`${year}-01-01`).getTime(),
    auctionFeesInEuros: 100,
    commissionsInEuros: 200,
    netReceiptsInEuros: 300,
    salesInEuros: 400,
    soldItems: 2,
    unsoldItems: 1,
  });
});
