import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("should create an item", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  // First create an auction to associate items with
  const auctionId = await asAdmin.run(async (ctx) => {
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

  // Create a new item
  await asAdmin.mutation(api.items.createItem, {
    auctionId,
    lotNo: 1,
    description: "Test Item",
    initialPrice: 100,
  });

  // Verify the item was created correctly
  const item = await asAdmin.run(async (ctx) => {
    return await ctx.db.query("items").first();
  });

  expect(item).toMatchObject({
    auctionId,
    description: "Test Item",
    lotNo: 1,
    initialPriceInCents: 10000, // 100 euros in cents
    hammerPriceInCents: 0,
  });
});

test("should get items for an auction", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  // Create an auction
  const auctionId = await asAdmin.run(async (ctx) => {
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

  // Insert two items
  await asAdmin.run(async (ctx) => {
    await ctx.db.insert("items", {
      auctionId,
      lotNo: 1,
      description: "First Item",
      initialPriceInCents: 10000,
      hammerPriceInCents: 0,
    });
    await ctx.db.insert("items", {
      auctionId,
      lotNo: 2,
      description: "Second Item",
      initialPriceInCents: 20000,
      hammerPriceInCents: 0,
    });
  });

  // Get items for the auction
  const items = await asAdmin.query(api.items.getItems, { auctionId });

  expect(items).toHaveLength(2);
  expect(items[0]).toMatchObject({
    description: "Second Item",
    lotNo: 2,
    initialPriceInEuros: 200,
    hammerPriceInEuros: 0,
  });
  expect(items[1]).toMatchObject({
    description: "First Item",
    lotNo: 1,
    initialPriceInEuros: 100,
    hammerPriceInEuros: 0,
  });
});

test("should update an item", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  // Create an auction and item
  const auctionId = await asAdmin.run(async (ctx) => {
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

  const itemId = await asAdmin.run(async (ctx) => {
    return await ctx.db.insert("items", {
      auctionId,
      lotNo: 1,
      description: "Original Description",
      initialPriceInCents: 10000,
      hammerPriceInCents: 0,
    });
  });

  // Update the item
  await asAdmin.mutation(api.items.updateItem, {
    itemId,
    updates: {
      description: "Updated Description",
      hammerPriceInEuros: 150,
      billedOn: "John Doe",
    },
  });

  // Verify the update
  const updatedItem = await asAdmin.run(async (ctx) => {
    return await ctx.db.get(itemId);
  });

  expect(updatedItem).toMatchObject({
    description: "Updated Description",
    hammerPriceInCents: 15000, // 150 euros in cents
    billedOn: "John Doe",
  });
});

test("should get bidder items", async () => {
  const year = 2025;
  const t = convexTest(schema);
  const asAdmin = t.withIdentity({ name: "Admin" });

  // Create an auction
  const auctionId = await asAdmin.run(async (ctx) => {
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

  // Insert items for different bidders
  await asAdmin.run(async (ctx) => {
    await ctx.db.insert("items", {
      auctionId,
      lotNo: 1,
      description: "John's Item 1",
      initialPriceInCents: 10000,
      hammerPriceInCents: 15000,
      billedOn: "John Doe",
    });
    await ctx.db.insert("items", {
      auctionId,
      lotNo: 2,
      description: "John's Item 2",
      initialPriceInCents: 20000,
      hammerPriceInCents: 25000,
      billedOn: "John Doe",
    });
    await ctx.db.insert("items", {
      auctionId,
      lotNo: 3,
      description: "Jane's Item",
      initialPriceInCents: 30000,
      hammerPriceInCents: 35000,
      billedOn: "Jane Smith",
    });
  });

  // Get bidder items
  const bidderItems = await asAdmin.query(api.items.getBidderItems, {
    auctionId,
  });

  expect(bidderItems).toHaveLength(2); // Two bidders

  // Find John's items
  const johnItems = bidderItems.find((b) => b.bidder === "John Doe");
  expect(johnItems?.items).toHaveLength(2);
  expect(johnItems?.items[0]).toMatchObject({
    description: "John's Item 1",
    lotNumber: 1,
    hammerPriceInEuros: 150,
  });
  expect(johnItems?.items[1]).toMatchObject({
    description: "John's Item 2",
    lotNumber: 2,
    hammerPriceInEuros: 250,
  });

  // Find Jane's items
  const janeItems = bidderItems.find((b) => b.bidder === "Jane Smith");
  expect(janeItems?.items).toHaveLength(1);
  expect(janeItems?.items[0]).toMatchObject({
    description: "Jane's Item",
    lotNumber: 3,
    hammerPriceInEuros: 350,
  });
});
