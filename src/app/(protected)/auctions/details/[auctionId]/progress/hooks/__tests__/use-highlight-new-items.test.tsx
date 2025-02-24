/// <reference types="@testing-library/jest-dom" />
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Id } from "../../../../../../../../../convex/_generated/dataModel";
import { useHighlightNewItems } from "../use-highlight-new-items";

// Mock data
type TestItem = { id: Id<"items">; name: string };

describe("useHighlightNewItems", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not highlight items on initial render", () => {
    const initialItems: TestItem[] = [
      { id: "item1" as Id<"items">, name: "Item 1" },
      { id: "item2" as Id<"items">, name: "Item 2" },
    ];

    const { result } = renderHook(() => useHighlightNewItems(initialItems));

    expect(result.current.newItemIds.size).toBe(0);
  });

  it("should highlight new items when they appear", () => {
    // Initial render with some items
    const initialItems: TestItem[] = [
      { id: "item1" as Id<"items">, name: "Item 1" },
      { id: "item2" as Id<"items">, name: "Item 2" },
    ];

    const { result, rerender } = renderHook(
      (props) => useHighlightNewItems(props),
      { initialProps: initialItems }
    );

    // First render should not highlight anything
    expect(result.current.newItemIds.size).toBe(0);

    // Add a new item
    const updatedItems: TestItem[] = [
      ...initialItems,
      { id: "item3" as Id<"items">, name: "Item 3" },
    ];

    // Rerender with the updated items
    rerender(updatedItems);

    // Should highlight the new item
    expect(result.current.newItemIds.size).toBe(1);
    expect(result.current.newItemIds.has("item3" as Id<"items">)).toBe(true);
  });

  it("should remove highlights after the duration", () => {
    // Initial render with some items
    const initialItems: TestItem[] = [
      { id: "item1" as Id<"items">, name: "Item 1" },
    ];

    const { result, rerender } = renderHook(
      (props) => useHighlightNewItems(props),
      { initialProps: initialItems }
    );

    // Add a new item
    const updatedItems: TestItem[] = [
      ...initialItems,
      { id: "item2" as Id<"items">, name: "Item 2" },
    ];

    // Rerender with the updated items
    rerender(updatedItems);

    // Should highlight the new item
    expect(result.current.newItemIds.size).toBe(1);

    // Fast-forward time to just before the highlight duration ends
    act(() => {
      vi.advanceTimersByTime(3999);
    });

    // Highlight should still be active
    expect(result.current.newItemIds.size).toBe(1);

    // Fast-forward time to after the highlight duration
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Highlight should be removed
    expect(result.current.newItemIds.size).toBe(0);
  });

  it("should handle multiple new items", () => {
    // Initial render with some items
    const initialItems: TestItem[] = [
      { id: "item1" as Id<"items">, name: "Item 1" },
    ];

    const { result, rerender } = renderHook(
      (props) => useHighlightNewItems(props),
      { initialProps: initialItems }
    );

    // Add multiple new items
    const updatedItems: TestItem[] = [
      ...initialItems,
      { id: "item2" as Id<"items">, name: "Item 2" },
      { id: "item3" as Id<"items">, name: "Item 3" },
    ];

    // Rerender with the updated items
    rerender(updatedItems);

    // Should highlight both new items
    expect(result.current.newItemIds.size).toBe(2);
    expect(result.current.newItemIds.has("item2" as Id<"items">)).toBe(true);
    expect(result.current.newItemIds.has("item3" as Id<"items">)).toBe(true);
  });

  it("should handle empty items array", () => {
    const { result } = renderHook(() => useHighlightNewItems<TestItem>([]));

    expect(result.current.newItemIds.size).toBe(0);
  });

  it("should not highlight items that were removed and re-added", () => {
    // Initial render with some items
    const initialItems: TestItem[] = [
      { id: "item1" as Id<"items">, name: "Item 1" },
      { id: "item2" as Id<"items">, name: "Item 2" },
    ];

    const { result, rerender } = renderHook(
      (props) => useHighlightNewItems(props),
      { initialProps: initialItems }
    );

    // Remove an item
    const reducedItems: TestItem[] = [
      { id: "item1" as Id<"items">, name: "Item 1" },
    ];

    rerender(reducedItems);

    // Re-add the removed item
    rerender(initialItems);

    // Should highlight the re-added item
    expect(result.current.newItemIds.size).toBe(1);
    expect(result.current.newItemIds.has("item2" as Id<"items">)).toBe(true);
  });
});
