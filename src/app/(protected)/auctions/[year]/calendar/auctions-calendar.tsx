import {
  auctionDeleteDialogAtom,
  auctionDetailsPopoverAtom,
} from "@/app/global-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Calendar } from "@/components/ui/calendar";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { unixToDate } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { useCalendar } from "../hooks/use-calendar";
import { DayContent } from "./calendar-day-content";
import { CreateAuctionDialog } from "./create-auction-dialog";
import { DeleteAuctionDialogContent } from "./delete-auction-dialog-content";

const CALENDAR_CELL_SIZE = "size-10";
const CALENDAR_CLASS_NAMES = {
  months: "w-full",
  month: "w-full",
  table: "w-full border-collapse",
  head_row: "flex",
  head_cell: "rounded-md w-10 font-normal text-sm",
  row: "flex w-full mt-2",
  cell: `${CALENDAR_CELL_SIZE} text-center text-md p-0 relative focus-within:relative focus-within:z-20`,
  day: `${CALENDAR_CELL_SIZE} p-0 font-normal text-md`,
  day_selected: "",
  day_outside: "opacity-0 pointer-events-none",
  day_disabled: "text-muted-foreground opacity-50",
  day_hidden: "invisible",
  nav: "hidden",
  caption:
    "flex justify-start pl-2 relative items-center mb-4 [&>div]:!text-lg ",
} as const;

export function AuctionsCalendar() {
  const [auctionDetailsPopover, setAuctionDetailsPopover] = useAtom(
    auctionDetailsPopoverAtom
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDialogDate, setCreateDialogDate] = useState<Date | undefined>();
  const [isAuctionDeleteInProgress, setIsAuctionDeleteInProgress] =
    useState(false);
  const [auctionDeleteDialog, setAuctionDeleteDialog] = useAtom(
    auctionDeleteDialogAtom
  );
  const deleteAuction = useMutation(api.auctions.deleteAuction);
  const { handleError } = useMutationErrorHandler();
  const params = useParams<{ year: string }>();
  const auctionsQuery = useQuery(api.auctions.getAuctions, {
    year: Number(params.year),
  });

  const auctions = useMemo(() => auctionsQuery ?? [], [auctionsQuery]);
  const { isAuctionDate, getAuctionForDate, generateYearMonths } =
    useCalendar();
  const months = generateYearMonths(Number(params.year));

  const handleDayClick = useCallback(
    (date: Date) => {
      if (isAuctionDate(auctions!, date)) {
        setAuctionDetailsPopover({
          visible: true,
          auction: getAuctionForDate(auctions, date)!,
        });
      } else {
        setCreateDialogDate(date);
        setIsCreateDialogOpen(true);
      }
    },
    [isAuctionDate, auctions, getAuctionForDate, setAuctionDetailsPopover]
  );

  const onAuctionDeleteConfirmed = (confirmed: boolean) => {
    if (!confirmed) return;
    setAuctionDeleteDialog({ visible: false, auction: null });
    setIsAuctionDeleteInProgress(true);
    const auction = auctionDeleteDialog.auction!;
    deleteAuction({ id: auction._id })
      .then(() => {
        toast({
          title: "Auction deleted",
          variant: "default",
        });
        setAuctionDetailsPopover({ visible: false, auction: null });
      })
      .catch(handleError)
      .finally(() => {
        setIsAuctionDeleteInProgress(false);
      });
  };

  const calendarContent = useCallback(
    ({ date, calendarMonth }: { date: Date; calendarMonth: Date }) => (
      <DayContent
        date={date}
        calendarMonth={calendarMonth}
        handleDayClick={handleDayClick}
        auctions={auctions}
      />
    ),
    [handleDayClick, auctions]
  );

  return (
    <>
      <div className="">
        <div className="mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[960px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {months.map(({ calendarMonth, key }) => (
              <div key={key} className="flex justify-center">
                <Calendar
                  mode="single"
                  month={calendarMonth}
                  selected={undefined}
                  onSelect={() => {}}
                  modifiers={{
                    highlighted: auctions.map((auction) =>
                      unixToDate(auction.dateTimestamp)
                    ),
                  }}
                  weekStartsOn={1}
                  className=""
                  classNames={CALENDAR_CLASS_NAMES}
                  formatters={{
                    formatCaption: (date) => {
                      return date.toLocaleString("default", { month: "long" });
                    },
                  }}
                  components={{
                    DayContent: ({ date }) =>
                      calendarContent({ date, calendarMonth }),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <CreateAuctionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultDate={createDialogDate}
      />
      <ConfirmDialog
        actionButton={{ text: "Delete", variant: "destructive" }}
        content={
          <DeleteAuctionDialogContent auction={auctionDetailsPopover.auction} />
        }
        isActionInProgress={isAuctionDeleteInProgress}
        isOpen={auctionDeleteDialog.visible}
        onConfirm={(confirmed) => {
          setAuctionDeleteDialog({ visible: false, auction: null });
          onAuctionDeleteConfirmed(confirmed);
        }}
        title="Delete auction"
      />
    </>
  );
}
