"use client";

import { ConvexError, Value } from "convex/values";
import { useToast } from "./use-toast";

export function useMutationErrorHandler() {
  const { toast } = useToast();

  function handleError(error: unknown) {
    console.log("HANDLER GOT ERROR:", error);
    if (error instanceof ConvexError) {
      if (isRateLimitedError(error)) {
        window.location.href = "/rate-limited";
      } else {
        toast({
          title: "Error",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          description: error.data,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Unexpected error has occured. Please try again later.",
        variant: "destructive",
      });
    }
  }

  function isRateLimitedError<TData extends Value>(
    error: ConvexError<TData>
  ): boolean {
    return (
      typeof error.data === "object" &&
      error.data != null &&
      "kind" in error.data &&
      error.data.kind === "RateLimited"
    );
  }

  return { handleError };
}
