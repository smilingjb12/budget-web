import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { cn, toServerDate, unixToDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../../convex/_generated/api";
import { useCalendar } from "../hooks/use-calendar";

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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { handleError } = useMutationErrorHandler();
  const createAuction = useMutation(api.auctions.createAuction);
  const params = useParams<{ year: string }>();

  const auctionsQuery = useQuery(api.auctions.getAuctionsByYear, {
    year: Number(params.year),
  });

  const auctions = useMemo(() => auctionsQuery ?? [], [auctionsQuery]);
  const { isDisabledDay } = useCalendar();

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
      setCalendarOpen(false);
    }
  }, [open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const formattedDate = toServerDate(values.date);
    createAuction({ date: formattedDate })
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

  const disabledDays = useCallback(
    (date: Date) => isDisabledDay(auctions, date),
    [auctions, isDisabledDay]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create auction</DialogTitle>
        </DialogHeader>
        <form onSubmit={void form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <div>
                <label className="text-sm font-medium">Date</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1.5",
                        !field.value && "text-muted-foreground",
                        form.formState.errors.date &&
                          "border-destructive ring-destructive focus-visible:ring-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCalendarOpen(false);
                      }}
                      disabled={disabledDays}
                      modifiers={{
                        highlighted: auctions.map((auction) =>
                          unixToDate(auction.dateTimestamp)
                        ),
                      }}
                      modifiersClassNames={{
                        highlighted:
                          "!bg-primary !text-primary-foreground !rounded-full !hover:bg-primary !hover:text-primary-foreground",
                      }}
                      classNames={{
                        day_selected: "!rounded-full",
                      }}
                      weekStartsOn={1}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.date && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className="pt-6">
            <ActionButton
              type="submit"
              className="w-25 float-right"
              isLoading={isLoading}
            >
              Create
            </ActionButton>
            <Button
              className="w-25 float-right mr-2"
              onClick={(e) => {
                e.preventDefault();
                onOpenChange(false);
                form.reset();
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
