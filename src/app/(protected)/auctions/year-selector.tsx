import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function YearSelector() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isOpen, setIsOpen] = useState(false);

  const years = [
    [2025, 2024, 2023, 2022, 2021],
    [2020, 2019, 2018, 2017, 2016],
    [2015, 2014, 2013, 2012, 2011],
  ];

  return (
    <div className="w-full max-w-md p-4 pl-0">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="cursor-pointer flex items-center text-3xl font-bold text-foreground hover:text-foreground/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Select year"
          >
            {selectedYear}
            <ChevronDown
              className={`ml-1 h-5 w-5 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-6" align="start">
          {years.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 gap-2 mb-2 last:mb-0"
            >
              {row.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsOpen(false);
                  }}
                  className={`p-2 px-4 rounded-full text-center transition-colors cursor-pointer
                    hover:text-primary hover:outline-none hover:ring-2 hover:ring-primary
                    ${selectedYear === year ? "bg-primary text-primary-foreground hover:text-primary-foreground" : ""}
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
