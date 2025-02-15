import { ActionButton } from "@/components/action-button";
import { DatePicker } from "@/components/date-picker";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";

interface CreateAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAuctionDialog({
  open,
  onOpenChange,
}: CreateAuctionDialogProps) {
  const [auctionDate, setAuctionDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useMutationErrorHandler();
  const createAuction = useMutation(api.auctions.createAuction);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[95vw] md:max-w-[400px]">
        <form>
          <AlertDialogHeader>
            <AlertDialogTitle>Create auction</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground pb-1">
                Date
              </label>
              <DatePicker
                date={auctionDate}
                onSelect={setAuctionDate}
                placeholder="Select auction date"
              />
            </div>
          </div>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="w-25">Cancel</AlertDialogCancel>
            <ActionButton
              type="button"
              className="w-25"
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                createAuction({ date: auctionDate!.toISOString() })
                  .then(() => {
                    setAuctionDate(undefined);
                    onOpenChange(false);
                    toast({
                      title: "Auction created",
                    });
                  })
                  .catch(handleError)
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
            >
              Create
            </ActionButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
