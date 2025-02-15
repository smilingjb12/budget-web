"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { FieldError } from "react-hook-form";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  popoverContentClassName?: string;
  disabled?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  required?: boolean;
  onChange?: (date?: Date) => void;
  value?: Date;
  error?: FieldError;
  label?: string;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  popoverContentClassName,
  disabled = false,
  side,
  align,
  onChange,
  value,
  error,
  label,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = value || date;

  const handleSelect = (date?: Date) => {
    onChange?.(date);
    onSelect?.(date);
    setOpen(false);
  };

  return (
    <div>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              error &&
                "border-destructive ring-destructive focus-visible:ring-destructive",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          className={cn("w-auto p-0", popoverContentClassName)}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
