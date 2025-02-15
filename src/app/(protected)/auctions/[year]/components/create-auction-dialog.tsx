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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../../convex/_generated/api";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
});

interface CreateAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

export function CreateAuctionDialog({
  open,
  onOpenChange,
  defaultDate,
}: CreateAuctionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useMutationErrorHandler();
  const createAuction = useMutation(api.auctions.createAuction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultDate,
    },
  });

  useEffect(() => {
    if (defaultDate) {
      form.setValue("date", defaultDate);
    }
  }, [defaultDate, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    createAuction({ date: values.date.toISOString() })
      .then(() => {
        form.reset();
        onOpenChange(false);
        toast({
          title: "Auction created",
          variant: "default",
        });
      })
      .catch(handleError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[95vw] md:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create auction</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(date) => field.onChange(date)}
                placeholder="Select a date"
                label="Date"
                error={form.formState.errors.date}
              />
            )}
          />
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="w-25" onClick={() => form.reset()}>
              Cancel
            </AlertDialogCancel>
            <ActionButton type="submit" className="w-25" isLoading={isLoading}>
              Create
            </ActionButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
