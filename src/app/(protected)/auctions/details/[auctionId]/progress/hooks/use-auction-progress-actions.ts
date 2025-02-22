import { toast } from "@/hooks/use-toast";
import { Row } from "@tanstack/react-table";
import { ItemDto } from "../../../../../../../../convex/lib/types";

export const useAuctionProgressActions = () => {
  // TODO: Add actual mutations when ready
  const handleWithhold = (rows: Row<ItemDto>[]): Promise<void> => {
    return new Promise<void>((resolve) => {
      toast({
        title: `Withholding ${rows.length} items`,
        variant: "default",
      });
      resolve();
    });
  };

  const handleDelete = (rows: Row<ItemDto>[]): Promise<void> => {
    return new Promise<void>((resolve) => {
      toast({
        title: `Deleting ${rows.length} items`,
        variant: "default",
      });
      resolve();
    });
  };

  return {
    handleWithhold,
    handleDelete,
  };
};
