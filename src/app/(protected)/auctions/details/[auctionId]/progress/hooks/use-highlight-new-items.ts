import { useEffect, useRef, useState } from "react";
import { Id } from "../../../../../../../../convex/_generated/dataModel";

export const useHighlightNewItems = <T extends { id: Id<"items"> }>(
  items: T[],
  highlightDuration = 3000
) => {
  const [newItemIds, setNewItemIds] = useState<Set<Id<"items">>>(new Set());
  const prevItemsRef = useRef<T[]>([]);
  const initialItemsLengthRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip if items is empty (initial load or error state)
    if (items.length === 0) {
      return;
    }

    // Set initial items length if not set
    if (initialItemsLengthRef.current === null) {
      initialItemsLengthRef.current = items.length;
      prevItemsRef.current = items;
      return;
    }

    const newIds = items
      .filter(
        (item) => !prevItemsRef.current.find((prev) => prev.id === item.id)
      )
      .map((item) => item.id);

    if (newIds.length > 0) {
      setNewItemIds(new Set(newIds));
      setTimeout(() => {
        setNewItemIds(new Set());
      }, highlightDuration);
    }

    prevItemsRef.current = items;
  }, [items, highlightDuration]);

  return { newItemIds };
};
